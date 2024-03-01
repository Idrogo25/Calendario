import axios from 'axios'


export const BASEURL = 'http://localhost:3000'




export const modificaDato = async (tabla: string, id: number, dato: object) => {
  try {
    await axios.put(`${BASEURL}/${tabla}/${id}`, dato)
  } catch (e) {
    console.log(e)
  }
}


export const obtenerDatos = async (tabla: string) => {
  try {
    //Esta línea hay que quitarla cuando comprobemos que se muestra el texto de cargando
    
    const response = await axios.get(`${BASEURL}/${tabla}`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}
export const eliminaDato = async (tabla: string, id: string) => {
  try {
    await axios.delete(`${BASEURL}/${tabla}/${id}`)
  } catch (e) {
    console.log(e)
  }
}


