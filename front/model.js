new Vue({
  el: '#app',
  data() {
    return {
      info: [],
      errores: "",
      contadorTareasTotales: 0,
      contadorTareasPendientes: 0,
      contadorTareasTerminadas: 0,
      newTask: {    //Refactorizado
        id: 0,
        title: "",
        date: "",
        time: "",
        done: false,
      }
    }
  },
  created() {
    this.dameDatos();
  },
  methods: {
    generarId: function () {    //Refactorizado
      var id = uuid.v1();
      return id;
    },
    dameDatos: function () {
      axios
        .get('https://newtodos.herokuapp.com/todos')
        .then(response => {
          this.errored = false;
          this.info = response.data;
          this.contadorTareasTotales = 0;
          this.contadorTareasPendientes = 0;
          this.contadorTareasTerminadas = 0;
          this.contadorTareasTotales = this.info.length;
          for (var i = 0; i < this.info.length; i++) {
            if (this.info[i].done) {
              this.contadorTareasTerminadas++;
            } else {
              this.contadorTareasPendientes++;
            }
          }
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
    },
    newItem: function () { //Refactorizado
      let errorDatos = [];
      this.newTask.id = this.generarId();
      errorDatos = this.validarDatos(this.newTask);
      if (errorDatos.length == 0) {
        axios
          .post('https://newtodos.herokuapp.com/newTask', {
            task: this.newTask,
          })
          .then(response => {
            this.errored = false;
            this.errores = "";
            this.newTask.id = "";
            this.newTask.title = "";
            this.newTask.date = "";
            this.newTask.time = "";
            this.dameDatos();
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          })
      } else {
        this.errores = errorDatos;
        return this.errores;
      }
    },
    deleteItem: function (tarea) { //Refactorizado
      axios
        .delete('https://newtodos.herokuapp.com/byeTask/' + tarea.id, {
        })
        .then(response => {
          this.errored = false;
          this.contadorTareasTerminadas++;
          this.contadorTareasPendientes--;
          this.dameDatos();
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
    },
    updateTick: function (tarea) { //Refactorizado
     
    updateItem: function (tarea) { //Refactorizado
      errorDatos = this.validarDatos(tarea);
      if (errorDatos.length == 0) {
        axios
          .put('https://newtodos.herokuapp.com/task/' + tarea.id, tarea)
          .then(response => {
            this.errored = false;
            this.errores = "";
            this.newTask.id = "";
            this.newTask.title = "";
            this.newTask.date = "";
            this.newTask.time = "";
            this.dameDatos();
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          })
      } else {
        this.errores = errorDatos;
        return this.errores;
      }
    },
    showItem: function (tarea) { //Refactorizado
      axios
        .get('https://newtodos.herokuapp.com')
        .then(response => {
          this.errored = false;
          this.errores = "";
          this.newTask = tarea;
          this.dameDatos();
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
    },
    validarDatos: function (tarea) {
      let error = [];
      let cont = 0;
      let fechaActual = moment();
      let patronHora = /(0[1-9]|1\d|2[0-3]):([0-5]\d)/;
      if (!tarea.id || tarea.id <= 0) {
        error[cont] = "Id debe ser mayor que 0";
        cont++;
      }
      if (!tarea.title) {

        error[cont] = "Rellene campo título";
        cont++;
      }
      if (!tarea.date || !new Date(tarea.date) || moment(tarea.date).isBefore(fechaActual)) {

        error[cont] = "Fecha formato incorrecto, debe ser AAAA-MM-DD o fecha anterior";
        cont++;
      }
      if (!tarea.time || !patronHora.test(tarea.time)) {
        error[cont] = "Hora con formato incorrecto, debe ser HH:MM";
      }
      return error;
    }
  }
})
