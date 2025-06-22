import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Asegúrate de crear este archivo para los estilos

function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'https://mini-core-c.onrender.com/comisiones'; // URL de tu API NestJS

  const fetchCommissions = async () => {
    setLoading(true);
    setError(null);
    setCommissions([]); // Limpiar resultados anteriores

    // Validar que las fechas no estén vacías
    if (!startDate || !endDate) {
      setError('Por favor, selecciona una fecha de inicio y una fecha de fin.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
      setCommissions(response.data);
    } catch (err) {
      console.error('Error fetching commissions:', err);
      if (err.response) {
        // El servidor respondió con un estado fuera del rango 2xx
        setError(`Error del servidor: ${err.response.status} - ${err.response.data.message || err.response.data}`);
      } else if (err.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        setError('No se recibió respuesta del servidor. Asegúrate de que el backend esté corriendo y CORS esté configurado.');
      } else {
        // Algo más causó el error
        setError('Error al enviar la solicitud: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Puedes añadir un useEffect para cargar las comisiones al inicio con fechas por defecto
  // o solo cuando el usuario las solicite
   useEffect(() => {
  //   // Establecer fechas por defecto si lo deseas
    const defaultStartDate = '2025-05-01';
     const defaultEndDate = '2025-06-30';
     setStartDate(defaultStartDate);
     setEndDate(defaultEndDate);
     // Opcional: Llamar fetchCommissions aquí si quieres que cargue al inicio
     fetchCommissions();
   }, []);

  return (
    <div className="container">
      <h1>Calculadora de Comisiones</h1>

      <div className="filters">
        <div className="date-input">
          <label htmlFor="startDate">Fecha de Inicio:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="date-input">
          <label htmlFor="endDate">Fecha de Fin:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button onClick={fetchCommissions} disabled={loading}>
          {loading ? 'Cargando...' : 'Calcular Comisiones'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {commissions.length > 0 && (
        <div className="results">
          <h2>Resultados de Comisiones</h2>
          <table>
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha Venta</th>
                <th>Vendedor</th>
                <th>Monto</th>
                <th>% Regla Aplicada</th>
                <th>Comisión</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((venta) => (
                <tr key={venta._id}>
                  <td>{venta._id}</td>
                  <td>{new Date(venta.fechaVenta).toLocaleDateString()}</td>
                  <td>{venta.vendedor}</td>
                  <td>${venta.monto.toFixed(2)}</td>
                  <td>{(venta.reglaAplicada * 100).toFixed(2)}%</td> {/* Multiplicar por 100 para mostrar porcentaje */}
                  <td>${venta.comision.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mensaje si no hay comisiones para mostrar después de la carga */}
      {!loading && !error && commissions.length === 0 && startDate && endDate && (
        <p className="no-results">No se encontraron comisiones para el rango de fechas seleccionado.</p>
      )}
    </div>
  );
}

export default App;