import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const Dashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [gestiones, setGestiones] = useState([]);
  const [gestionesSeleccionadas, setGestionesSeleccionadas] = useState([]);

  const token = localStorage.getItem('token');

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar usuarios');
    }
  };

  const cargarGestiones = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/gestiones', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGestiones(res.data.map(g => ({ value: g.id, label: g.nombre })));
    } catch (err) {
      console.error('Error al cargar gestiones:', err);
      setError('Error al cargar gestiones');
    }
  };

  const cambiarEstado = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/usuarios/${id}/estado`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarUsuarios();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setError('Error al cambiar estado');
    }
  };

  useEffect(() => {
    cargarUsuarios();
    cargarGestiones();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Listado de usuarios registrados</p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Gestiones (multi-selección):</label>
        <Select
          components={animatedComponents}
          isMulti
          options={gestiones}
          value={gestionesSeleccionadas}
          onChange={setGestionesSeleccionadas}
        />
      </div>

      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4">Usuario</th>
            <th className="py-2 px-4">Nombre</th>
            <th className="py-2 px-4">Apellido</th>
            <th className="py-2 px-4">Rol</th>
            <th className="py-2 px-4">Gestión</th>
            <th className="py-2 px-4">Estado</th>
            <th className="py-2 px-4">Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id} className="border-t">
              <td className="py-2 px-4">{u.username}</td>
              <td className="py-2 px-4">{u.nombre}</td>
              <td className="py-2 px-4">{u.apellido}</td>
              <td className="py-2 px-4 capitalize">{u.rol}</td>
              <td className="py-2 px-4">{u.gestionId || '—'}</td>
              <td className="py-2 px-4">
                <button
                  className={`px-2 py-1 rounded text-white ${u.estado === 'activo' ? 'bg-green-600' : 'bg-gray-500'}`}
                  onClick={() => cambiarEstado(u.id)}
                >
                  {u.estado}
                </button>
              </td>
              <td className="py-2 px-4">
                <button className="text-blue-600 hover:underline">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
