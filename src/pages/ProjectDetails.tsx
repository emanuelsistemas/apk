import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  name: string;
  app_link?: string;
  icon_url?: string;
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [appLink, setAppLink] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Falha ao carregar projeto');
      return;
    }

    setProject(data);
    setAppLink(data.app_link || '');
  };

  const handleIconUpload = async (file: File) => {
    if (!project) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${project.id}-icon.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('project-icons')
      .upload(fileName, file);

    if (uploadError) {
      toast.error('Falha ao enviar ícone');
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-icons')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('projects')
      .update({ icon_url: publicUrl })
      .eq('id', project.id);

    if (updateError) {
      toast.error('Falha ao atualizar projeto');
      return;
    }

    fetchProject();
    toast.success('Ícone enviado com sucesso');
  };

  const handleGenerateApk = async () => {
    if (!project || !appLink) return;

    setIsGenerating(true);
    try {
      // Aqui você integraria com seu serviço de geração de APK
      // Por enquanto, vamos apenas simular o processo
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('APK gerado com sucesso!');
    } catch (error) {
      toast.error('Falha ao gerar APK');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveLink = async () => {
    if (!project) return;

    const { error } = await supabase
      .from('projects')
      .update({ app_link: appLink })
      .eq('id', project.id);

    if (error) {
      toast.error('Falha ao salvar link');
      return;
    }

    toast.success('Link salvo com sucesso');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar ao Painel
        </button>

        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">{project?.name}</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Link do Aplicativo
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={appLink}
                  onChange={(e) => setAppLink(e.target.value)}
                  placeholder="Digite o link do seu aplicativo"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                />
                <button
                  onClick={handleSaveLink}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Salvar
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ícone do Aplicativo
              </label>
              <div className="flex items-center space-x-4">
                {project?.icon_url && (
                  <img
                    src={project.icon_url}
                    alt="Ícone do Aplicativo"
                    className="w-16 h-16 rounded-lg"
                  />
                )}
                <label className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md cursor-pointer hover:bg-gray-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar Ícone
                  <input
                    type="file"
                    accept="image/png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setIconFile(file);
                        handleIconUpload(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <button
                onClick={handleGenerateApk}
                disabled={!appLink || isGenerating}
                className={`flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isGenerating ? 'animate-pulse' : ''
                }`}
              >
                <Download className="w-5 h-5 mr-2" />
                {isGenerating ? 'Gerando APK...' : 'Gerar APK'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}