import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    snapshot: {},
    patientList: [],
    route: {}
  }),
  getters: {
    pkeyExist: state => {
      if (!state.route.params || !state.route.params.pkey) {
        return false
      }
      if (state.patientList.find(x => x.pkey === state.route.params.pkey)) {
        return true
      }
      return false
    },
    currentPatient: state => {
      if (!state.route.params || !state.route.params.pkey) {
        return {}
      }
      return state.patientList.find(x => x.pkey === state.route.params.pkey)
    },
    dkeyExist: state => {
      if (!state.route.params || !state.route.params.pkey || !state.route.params.dkey) {
        return false
      }
      const patient = state.patientList.find(x => x.pkey === state.route.params.pkey)
      if (patient && patient.watermeterData.find(x => x.dkey === state.route.params.dkey)) {
        return true
      }
      return false
    },
    currentWaterMeterData: state => {
      if (!state.route.params || !state.route.params.pkey || !state.route.params.dkey) {
        return {}
      }
      const patient = state.patientList.find(x => x.pkey === state.route.params.pkey)
      if (!patient) {
        return {}
      }
      return patient.watermeterData.find(x => x.dkey === state.route.params.dkey)
    }
  },
  actions: {
    setSnapshot(snapshot) {
      this.snapshot = snapshot
      this.patientList = []
      for (const key in snapshot) {
        let waterMeterData = []
        for (const dkey in snapshot[key].watermeterData) {
          const newInstance = {
            dkey: dkey,
            date: snapshot[key].watermeterData[dkey].date,
            bw: snapshot[key].watermeterData[dkey].bw,
            bw_measure: snapshot[key].watermeterData[dkey].bw_measure,
            note: snapshot[key].watermeterData[dkey].note,
            wm: snapshot[key].watermeterData[dkey].wm,
            pn: snapshot[key].watermeterData[dkey].pn,
            dex: snapshot[key].watermeterData[dkey].pn.glu_conc,
            active: snapshot[key].watermeterData[dkey].active,
            lastUpdate: snapshot[key].watermeterData[dkey].lastUpdate,
            updateBy: snapshot[key].watermeterData[dkey].updateBy
          }
          if (!('heparin_perML' in newInstance.pn)) {
            newInstance.pn.heparin_perML = 0
          }
          if (!('heparin_prescribe' in newInstance.pn)) {
            newInstance.pn.heparin_prescribe = ''
          }
          waterMeterData.push(newInstance)
        }
        waterMeterData = waterMeterData.sort((a, b) => {
          return a.date === b.date
            ? -(new Date(a.lastUpdate) - new Date(b.lastUpdate))
            : -(new Date(a.date) - new Date(b.date))
        })
        let updateBy = snapshot[key].updateBy
        let lastUpdate = snapshot[key].lastUpdate
        if (waterMeterData.length > 0) {
          updateBy = waterMeterData[0].updateBy
          lastUpdate = waterMeterData[0].lastUpdate
        }
        this.patientList.push({
          name: snapshot[key].name,
          gender: snapshot[key].gender,
          hisid: snapshot[key].hisid,
          bedno: snapshot[key].bedno,
          active: snapshot[key].active,
          birthdate: snapshot[key].birthdate,
          ga_day: snapshot[key].ga_day,
          ga_week: snapshot[key].ga_week,
          lastUpdate: lastUpdate,
          updateBy: updateBy,
          number: waterMeterData.length,
          watermeterData: waterMeterData,
          pkey: key
        })
        this.patientList = this.patientList.sort((a, b) => {
          if (a.bedno === b.bedno) {
            return new Date(b.lastUpdate) - new Date(a.lastUpdate)
          }
          let numA = a.bedno.match(/\d+/)
          if (numA) { numA = numA[0] } else { numA = 999 }
          let numB = b.bedno.match(/\d+/)
          if (numB) { numB = numB[0] } else { numB = 999 }
          if (numA && !numB) {
            return true
          } else if (!numA && numB) {
            return false
          } else if (numA && numB) {
            return Number(numA) - Number(numB)
          }
          return a.bedno - b.bedno
        })
      }
    },
    setRoute(route) {
      this.route = route
    }
  }
})

export default useMainStore

