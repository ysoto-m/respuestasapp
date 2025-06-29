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
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [mostrarGestiones, setMostrarGestiones] = useState(false);
  const [mostrarPlantillas, setMostrarPlantillas] = useState(false);
  const [formUsuario, setFormUsuario] = useState({ username: '', nombre: '', apellido: '', rol: 'agente', password: '' });
  const [nuevaGestion, setNuevaGestion] = useState('');
  const [plantillas, setPlantillas] = useState([]);
  const [nuevaPlantilla, setNuevaPlantilla] = useState('');

  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const esSistema = usuario.rol === 'sistema';
  const esSupervisor = usuario.rol === 'supervisor';
  const [usuarioGestionIds, setUsuarioGestionIds] = useState([]);
  const [gestionPlantillaId, setGestionPlantillaId] = useState('');

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get('/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(res.data);
      if (esSupervisor) {
        const yo = res.data.find(u => u.id === usuario.id);
        if (yo && yo.Gestions) {
          setUsuarioGestionIds(yo.Gestions.map(g => g.id));
        }
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar usuarios');
    }
  };

  const cargarGestiones = async () => {
    try {
      const res = await axios.get('/gestiones', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGestiones(res.data.map(g => ({ value: g.id, label: g.nombre })));
    } catch (err) {
      console.error('Error al cargar gestiones:', err);
      setError('Error al cargar gestiones');
    }
  };

  const cargarPlantillas = async () => {
    try {
      const res = await axios.get('/plantillas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlantillas(res.data);
    } catch (err) {
      console.error('Error al cargar plantillas:', err);
    }
  };

  const crearUsuario = async () => {
    try {
      await axios.post('/usuarios', {
        ...formUsuario,
        gestiones: gestionesSeleccionadas.map(g => g.value)
      }, { headers: { Authorization: `Bearer ${token}` } });
      setFormUsuario({ username: '', nombre: '', apellido: '', rol: 'agente', password: '' });
      setGestionesSeleccionadas([]);
      setMostrarNuevo(false);
      cargarUsuarios();
    } catch (err) {
      console.error('Error al crear usuario:', err);
    }
  };

  const agregarGestion = async () => {
    try {
      await axios.post('/gestiones', { nombre: nuevaGestion }, { headers: { Authorization: `Bearer ${token}` } });
      setNuevaGestion('');
      cargarGestiones();
    } catch (err) {
      console.error('Error al crear gestion:', err);
    }
  };

  const agregarPlantilla = async () => {
    try {
      await axios.post('/plantillas', { texto: nuevaPlantilla, gestionId: gestionPlantillaId }, { headers: { Authorization: `Bearer ${token}` } });
      setNuevaPlantilla('');
      setGestionPlantillaId('');
      cargarPlantillas();
    } catch (err) {
      console.error('Error al crear plantilla:', err);
    }
  };

  const cambiarVisibilidad = async (id, visible) => {
    try {
      await axios.put(`/plantillas/${id}/visible`, { visible }, { headers: { Authorization: `Bearer ${token}` } });
      cargarPlantillas();
    } catch (err) {
      console.error('Error al actualizar plantilla:', err);
    }
  };

  const cambiarEstado = async (id) => {
    try {
      await axios.patch(`/usuarios/${id}/estado`, {}, {
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
    cargarPlantillas();
  }, []);

  const gestionesPlantilla = esSupervisor
    ? gestiones.filter(g => usuarioGestionIds.includes(g.value))
    : gestiones;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Listado de usuarios registrados</p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex gap-4 mb-4">
        <button onClick={() => setMostrarNuevo(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Nuevo usuario</button>
        {(esSistema || esSupervisor) && (
          <>
            {esSistema && (
              <button onClick={() => setMostrarGestiones(true)} className="bg-green-600 text-white px-4 py-2 rounded">Administrar gestiones</button>
            )}
            <button onClick={() => setMostrarPlantillas(true)} className="bg-purple-600 text-white px-4 py-2 rounded">Gestión de plantillas</button>
          </>
        )}
      </div>

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
              <td className="py-2 px-4">{u.Gestions?.map(g => g.nombre).join(', ') || '—'}</td>
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

      {mostrarNuevo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Nuevo usuario</h2>
            <input className="border p-2 w-full mb-2" placeholder="Usuario" value={formUsuario.username} onChange={e => setFormUsuario({ ...formUsuario, username: e.target.value })} />
            <input className="border p-2 w-full mb-2" placeholder="Nombre" value={formUsuario.nombre} onChange={e => setFormUsuario({ ...formUsuario, nombre: e.target.value })} />
            <input className="border p-2 w-full mb-2" placeholder="Apellido" value={formUsuario.apellido} onChange={e => setFormUsuario({ ...formUsuario, apellido: e.target.value })} />
            <select className="border p-2 w-full mb-2" value={formUsuario.rol} onChange={e => setFormUsuario({ ...formUsuario, rol: e.target.value })}>
              <option value="sistema">Sistema</option>
              <option value="supervisor">Supervisor</option>
              <option value="agente">Agente</option>
            </select>
            <input type="password" className="border p-2 w-full mb-2" placeholder="Contraseña" value={formUsuario.password} onChange={e => setFormUsuario({ ...formUsuario, password: e.target.value })} />
            <Select components={animatedComponents} isMulti options={gestiones} value={gestionesSeleccionadas} onChange={setGestionesSeleccionadas} className="mb-4" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setMostrarNuevo(false)} className="px-4 py-2">Cancelar</button>
              <button onClick={crearUsuario} className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {mostrarGestiones && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80">
            <h2 className="text-xl font-bold mb-4">Gestiones</h2>
            <div className="flex mb-4">
              <input className="border p-2 flex-1" placeholder="Nueva gestion" value={nuevaGestion} onChange={e => setNuevaGestion(e.target.value)} />
              <button onClick={agregarGestion} className="bg-green-600 text-white px-4 ml-2">Agregar</button>
            </div>
            <ul className="max-h-40 overflow-y-auto mb-4">
              {gestiones.map(g => (
                <li key={g.value} className="border-b py-1">{g.label}</li>
              ))}
            </ul>
            <div className="text-right">
              <button onClick={() => setMostrarGestiones(false)} className="px-4 py-2 bg-gray-200 rounded">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {mostrarPlantillas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Plantillas</h2>
            <textarea className="border p-2 w-full mb-2" rows="3" placeholder="Texto de la plantilla" value={nuevaPlantilla} onChange={e => setNuevaPlantilla(e.target.value)} />
            <select className="border p-2 w-full mb-2" value={gestionPlantillaId} onChange={e => setGestionPlantillaId(Number(e.target.value))}>
              <option value="">Seleccione gestión</option>
              {gestionesPlantilla.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
            <div className="flex justify-end mb-4">
              <button onClick={agregarPlantilla} className="bg-purple-600 text-white px-4 py-2 rounded">Guardar</button>
            </div>
            <ul className="max-h-40 overflow-y-auto">
              {plantillas.map(p => (
                <li key={p.id} className="border-b py-1 flex justify-between items-center">
                  <span className="mr-2 flex-1">{p.texto}</span>
                  <button onClick={() => cambiarVisibilidad(p.id, !p.visible)} className="text-sm text-blue-600">{p.visible ? 'Ocultar' : 'Mostrar'}</button>
                </li>
              ))}
            </ul>
            <div className="text-right mt-2">
              <button onClick={() => setMostrarPlantillas(false)} className="px-4 py-2 bg-gray-200 rounded">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
