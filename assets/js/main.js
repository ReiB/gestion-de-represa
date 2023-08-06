// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgS5kfkL7SQE_g4H8xwJV8K6ppNRTeMQ0",
  authDomain: "gestion-de-represa.firebaseapp.com",
  databaseURL: "https://gestion-de-represa-default-rtdb.firebaseio.com",
  projectId: "gestion-de-represa",
  storageBucket: "gestion-de-represa.appspot.com",
  messagingSenderId: "932039907295",
  appId: "1:932039907295:web:da593b6b92fc77f51b166a",
  measurementId: "G-EWC1WLQDGQ"
};

firebase.initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();



function cargarTerminales(){
  let terminalHTML = $(".terminal-boton").clone();
  $(".terminal-boton").remove();

  db.collectionGroup("terminal").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        $('#permisos-boton').append(terminalHTML);
        $(".terminal-boton:last-child p").text(doc.id);
        //console.log(`${doc.id} => ${doc.data()}`);
    });
  });
}


//const ref = db.collection('mediciones');
//console.log(ref);
function cargarCards(){
  //Buscamos ultima medicion y actualizamos el componente Card
  db.collectionGroup("mediciones").orderBy("fecha_tomada").limitToLast(1)
    .get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      $('#nivel-actual-agua').text(doc.data().valor);
        $(".card-info-two #ultima-medida").text();
        $(".card-info-two #ultima-medida").append('<i class="fa fa-clock-o"></i>'+doc.data().fecha_tomada.toDate().toLocaleString());
        //estadotemp = doc.data().mensaje_id;
        //console.log(`${doc.id} => ${doc.data().fecha_tomada.toDate().toLocaleDateString()}`);

        //Leer tipo de medicion en los mensajes y actualizamos en el componente Card
        var docRef = db.collection("mensaje").doc(doc.data().mensaje_id);
        docRef.get().then((doc) => {
          $("#tipo-mensaje").text(doc.data().tipo);
        });
      });
  });

}


// Cargar Compuertas
function cargarCompuertas(){
  let compuertaHTML = $(".compuerta-item").html();
  $(".compuerta-item").remove();

  db.collectionGroup("compuertas").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      
        $("#compuertas-wrapper").append(compuertaHTML);
        $("#compuertas-wrapper").find(".num-compuerta").last().attr("id",doc.id);
        $("#compuertas-wrapper").find("#"+doc.id).text(doc.data().num_compuerta);
        if(doc.data().abierta){
          $("#compuertas-wrapper").find("#"+doc.id).next(".estado-compuerta").text("Abierta");
        } else {
          $("#compuertas-wrapper").find("#"+doc.id).next(".estado-compuerta").text("Cerrada");
        }
        
        //console.log(`${doc.id} => ${doc.data()}`);
    });
  });
}


//Cargar la grafica
async function cargarGrafica(){
  let mylabels = [];
  let mydata = [];
  await db.collectionGroup("mediciones").orderBy("fecha_tomada").limitToLast(15)
  .get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
       //console.log(`${doc.id} => ${doc.data().valor}`);
       let tlabel = String(doc.data().fecha_tomada.toDate().toLocaleString());
       let tdata = parseFloat(doc.data().valor);
       mylabels.push(tlabel);
       mydata.push(tdata);
    });
  });

  const ctx = document.getElementById('myChart');

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: mylabels,
      datasets: [{
        label: 'Nivel de Agua',
        data: mydata,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          display: true,
          ticks: {
              suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
              // OR //
              beginAtZero: true   // minimum value will be 0.
          },
          scaleLabel: {
            display: true,
            labelString: 'Metros (m)'
          }
        }],
        y: {
          beginAtZero: true
        },
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Fecha'
          }
        }],
        x: {
          beginAtZero: true
        }
      }
    }
  });


}

async function medirAgua(){
  
  let randomVal = Math.floor((Math.random() * 18) + 17);
  let randomMsm = "";
  if(randomVal>=0 && randomVal<=14) {randomMsm = "mensaje2";
  } else if(randomVal>=15 && randomVal<=24) { randomMsm = "mensaje3";
  } else if(randomVal>=25 && randomVal<=30) { randomMsm = "mensaje1";
  } else {randomMsm = "mensaje0";}

  // Add a new document with a generated id.
  await db.collection("terminal").doc("terminal0").collection("mediciones").add({
      automatica: false,
      fecha_tomada: firebase.firestore.Timestamp.now(),
      mensaje_id: randomMsm,
      valor: randomVal
  })
  .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
  
}

//Abrir o cerrar compuerta
function activarCompuerta(){
  alert("a");
  console.log($(this).parent(".num-compuerta").attr('id'));
}

//Funciones para remover valores estaticos del html y hacerlo dinamico  
$(document).ready(function(){
  cargarTerminales();
  cargarCards();
  cargarCompuertas();
  cargarGrafica();

  $("#medir-agua").on("click",medirAgua());

});