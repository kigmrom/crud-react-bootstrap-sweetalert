import './App.css';
import { useState, useEffect } from "react";
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anhos, setAnhos] = useState("");
  const [id, setID] = useState(0);

  const [editar, setEditar] = useState(false);

  const [empleadosList, setEmpleados] = useState([]);

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anhos: anhos
    })
    .then(() => {
      getEmpleados();
      cleanCampo();
      MySwal.fire({
        icon: "success",
        title: "<strong>Agregado Exitosamente!!</strong>",
        html: "<i>El empleado <strong>" + nombre + "</strong> fue registrado con éxito!!!</i>",
        timer: 2500
      });
    })
    .catch((error) => {
      MySwal.fire({
        icon: "error",
        title: "<strong>Error</strong>",
        html: "<i>Hubo un problema al intentar registrar los datos de <strong>" + nombre + "</strong>.</i>",
        footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
      });
    });
  };
  

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anhos: anhos
    })
    .then(() => {
      getEmpleados();
      cleanCampo();
      MySwal.fire({
        icon: "success",
        title: "<strong>Actualización Exitosa!!</strong>",
        html: "<i>Los datos de <strong>" + nombre + "</strong> fueron actualizados con éxito!!!</i>",
        timer: 2500
      });
    })
    .catch((error) => {
      MySwal.fire({
        icon: "error",
        title: "<strong>Error</strong>",
        html: "<i>Hubo un problema al intentar actualizar los datos de <strong>" + nombre + "</strong>.</i>",
        footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
      });
    });
  };
  

  const borrarEmpleado = (val) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      }
    });
  
    swalWithBootstrapButtons.fire({
      title: "<strong>¿Estás seguro?</strong>",
      html: "<i>Al borrar los datos de <strong>" + val.nombre + "</strong>, ¡No podrás revertir esta acción!</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, ¡elimínalo!",
      cancelButtonText: "No, ¡cancelar!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Si se confirma, se procede a eliminar el empleado
        Axios.delete(`http://localhost:3001/delete/${val.id}`)
          .then(() => {
            getEmpleados();
            cleanCampo();
            swalWithBootstrapButtons.fire({
              icon: "success",
              title: "<strong>¡Eliminación Exitosa!</strong>",
              html: "<i>Los datos de <strong>" + val.nombre + "</strong> fueron eliminados con éxito!!!</i>",
              timer: 2500
            });
          })
          .catch((error) => {
            swalWithBootstrapButtons.fire({
              icon: "error",
              title: "<strong>Error</strong>",
              html: "<i>Hubo un problema al intentar eliminar los datos de <strong>" + val.nombre + "</strong>.</i>",
              footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Si se cancela, muestra el mensaje de cancelación
        swalWithBootstrapButtons.fire({
          icon: "error",
          title: "<strong>Cancelado</strong>",
          html: "<i>La información de <strong>" + val.nombre + "</strong> está a salvo :)</i>",
          timer: 2500
        });
      }
    });
  };
  
  

  const cleanCampo = () => {
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setAnhos("");
    setID("");

    setEditar(false);
  }

  const editarEmpleado = (val) => {
    setEditar(true);

    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAnhos(val.anhos);
    setID(val.id)
  }

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((response) => {
      setEmpleados(response.data);
    })
  }

  useEffect(() => {
    getEmpleados();
  }, []);

  return (
    <div className="container">
      <div className='container-fluid p-5'>
        <div className="card text-center">
          <div className="card-header">
            Gestión de Empleados
          </div>
          <div className="card-body">
            <form>
              <div className="input-group mb-3">
                <span className="input-group-text" id="inputGroup-sizing-default">Nombre:</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese un nombre"
                  aria-label="Nombre"
                  value={nombre}
                  aria-describedby="inputGroup-sizing-default"
                  onChange={(event) => setNombre(event.target.value)}
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="inputGroup-sizing-default">Edad:</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ingrese la edad"
                  aria-label="Edad"
                  value={edad}
                  aria-describedby="inputGroup-sizing-default"
                  onChange={(event) => setEdad(event.target.value)}
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="inputGroup-sizing-default">País:</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese el país"
                  aria-label="País"
                  value={pais}
                  aria-describedby="inputGroup-sizing-default"
                  onChange={(event) => setPais(event.target.value)}
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="inputGroup-sizing-default">Cargo:</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese el cargo"
                  aria-label="Cargo"
                  value={cargo}
                  aria-describedby="inputGroup-sizing-default"
                  onChange={(event) => setCargo(event.target.value)}
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="inputGroup-sizing-default">Años:</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ingrese los años"
                  aria-label="Años"
                  value={anhos}
                  aria-describedby="inputGroup-sizing-default"
                  onChange={(event) => setAnhos(event.target.value)}
                />
              </div>
              {
                editar ?
                  <div aria-label="EditCancel">
                    <button type="button" onClick={update} className="btn btn-warning m-2">Actualizar</button>
                    <button type="button" onClick={cleanCampo} className="btn btn-info">Cancelar</button>
                  </div>
                  : <button className='btn btn-success' type="button" onClick={add}>Registrar</button>
              }
            </form>
          </div>
          <div className="card-footer text-body-secondary">
            © Kigmorm - 2024
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Edad</th>
                <th scope="col">País</th>
                <th scope="col">Cargo</th>
                <th scope="col">Experiencia</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
                empleadosList.map((val, key) => {
                  return <tr key={val.id}>
                    <th scope="row">{val.id}</th>
                    <td>{val.nombre}</td>
                    <td>{val.edad}</td>
                    <td>{val.pais}</td>
                    <td>{val.cargo}</td>
                    <td>{val.anhos}</td>
                    <td>
                      <div className="btn-group" role="group" aria-label="Acciones">
                        <button type="button"
                          onClick={() => {
                            editarEmpleado(val)
                          }}
                          className="btn btn-outline-warning">Editar</button>
                        <button type="button"
                         onClick={()=>{
                          borrarEmpleado(val);
                         }} 
                         className="btn btn-danger">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;