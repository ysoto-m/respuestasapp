// frontend/src/pages/Usuarios.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    username: '',
    nombre: '',
    apellido: '',
    rol: 'agente',
    estado: 'activo'
  });

  const token = localStorage.getItem('token');

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const guardarUsuario = async () => {
    try {
      if (editando) {
        await axios.put(`http://localhost:3000/api/usuarios/${editando}`, formulario, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:3000/api/usuarios', formulario, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setFormulario({ username: '', nombre: '', apellido: '', rol: 'agente', estado: 'activo' });
      setEditando(null);
      cargarUsuarios();
    } catch (err) {
      console.error(err);
    }
  };

  const cambiarEstado = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/usuarios/${id}/estado`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarUsuarios();
    } catch (err) {
      console.error(err);
    }
  };

  const editar = (usuario) => {
    setEditando(usuario.id);
    setFormulario({
      username: usuario.username,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      estado: usuario.estado
    });
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{editando ? 'Editar usuario' : 'Crear usuario'}</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          className="border p-2"
          placeholder="Username"
          value={formulario.username}
          onChange={(e) => setFormulario({ ...formulario, username: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Apellido"
          value={formulario.apellido}
          onChange={(e) => setFormulario({ ...formulario, apellido: e.target.value })}
        />
        <select
          className="border p-2"
          value={formulario.rol}
          onChange={(e) => setFormulario({ ...formulario, rol: e.target.value })}
        >
          <option value="sistema">Sistema</option>
          <option value="supervisor">Supervisor</option>
          <option value="agente">Agente</option>
        </select>
        <button onClick={guardarUsuario} className="col-span-2 bg-blue-600 text-white py-2 rounded">
          {editando ? 'Actualizar' : 'Guardar'}
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Lista de usuarios</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Username</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Apellido</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.nombre}</td>
              <td className="p-2">{u.apellido}</td>
              <td className="p-2">{u.rol}</td>
              <td className="p-2">{u.estado}</td>
              <td className="p-2 flex gap-2">
                <button onClick={() => editar(u)} className="bg-yellow-500 px-3 py-1 text-white rounded">
                  Editar
                </button>
                <button onClick={() => cambiarEstado(u.id)} className="bg-gray-600 px-3 py-1 text-white rounded">
                  {u.estado === 'activo' ? 'Inactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;
