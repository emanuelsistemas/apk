import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Plus, LogOut, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  created_at: string;
  user_id: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const { signOut, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [session]);

  const fetchProjects = async () => {
    if (!session?.user.id) return;
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Falha ao carregar projetos');
      return;
    }

    setProjects(data || []);
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !session?.user.id) return;

    const { error } = await supabase.from('projects').insert([
      {
        name: newProjectName,
        user_id: session.user.id,
      },
    ]);

    if (error) {
      toast.error('Falha ao criar projeto');
      return;
    }

    setNewProjectName('');
    setShowNewProject(false);
    fetchProjects();
    toast.success('Projeto criado com sucesso');
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;

    const { error } = await supabase
      .from('projects')
      .update({ name: editingProject.name })
      .eq('id', editingProject.id);

    if (error) {
      toast.error('Falha ao atualizar projeto');
      return;
    }

    setEditingProject(null);
    fetchProjects();
    toast.success('Projeto atualizado com sucesso');
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Falha ao excluir projeto');
      return;
    }

    setShowDeleteConfirm(null);
    fetchProjects();
    toast.success('Projeto excluído com sucesso');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error('Falha ao sair');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Meus Projetos</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </button>
        </div>

        <button
          onClick={() => setShowNewProject(true)}
          className="mb-8 flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg relative"
            >
              {editingProject?.id === project.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingProject.name}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdateProject}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3
                    className="text-xl font-semibold text-white mb-4 cursor-pointer hover:text-indigo-400"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    {project.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(project.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Novo Projeto */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Criar Novo Projeto</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Nome do projeto"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewProject(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Confirmar Exclusão</h2>
            <p className="text-gray-300 mb-4">
              Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteProject(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}