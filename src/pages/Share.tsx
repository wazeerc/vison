import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Footer from '../components/Footer';
import Header from '../components/Header';
import JsonInput from '../components/JsonInput';
import JsonTable from '../components/JsonTable';
import JsonTreeView from '../components/JsonTreeView';
import { formatJson, getJsonDepth, JsonValue, parseJson } from '../utils/jsonUtils';

const EXPIRY_MINUTES = 15;

const SharePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jsonString, setJsonString] = useState('');
  const [parsedData, setParsedData] = useState<JsonValue | null>(null);
  const [isArray, setIsArray] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    import('../lib/supabaseClient').then(({ supabase }) => {
      supabase
        .from('shared_json')
        .select('json,created_at')
        .eq('id', id)
        .single()
        .then(async ({ data, error }) => {
          setLoading(false);
          if (error || !data) {
            setError('Invalid or expired share link.');
            return;
          }
          // Check expiry
          const created = new Date(data.created_at);
          const now = new Date();
          const diff = (now.getTime() - created.getTime()) / 1000 / 60;
          if (diff > EXPIRY_MINUTES) {
            setExpired(true);
            setError('This Vison link has expired.');
            return;
          }
          const keyStr = window.location.hash.replace(/^#/, '');
          if (!keyStr) {
            setError('Missing decryption key in link.');
            return;
          }

          try {
            const { importKey, decryptJson } = await import('../utils/cryptoUtils');
            const key = await importKey(keyStr);
            const decrypted = await decryptJson(data.json.ciphertext, data.json.iv, key);

            setParsedData(decrypted);
            setJsonString(formatJson(decrypted));
            setIsArray(Array.isArray(decrypted));
          } catch (e) {
            console.error(e);
            setError('Failed to decrypt shared JSON.');
            return;
          }
          toast.info('You are viewing a shared JSON file.');
        });
    });
  }, [id]);

  const handleJsonChange = (json: string) => {
    setJsonString(json);
    if (!json.trim()) {
      setParsedData(null);
      setError(null);
      setIsArray(false);
      return;
    }
    const result = parseJson(json);
    setParsedData(result.data);
    setError(result.error);
    setIsArray(result.isArray);
    if (result.error) {
      toast.error(`JSON Parse Error: ${result.error}`);
    }
  };

  const handleDataChange = (updatedData: JsonValue) => {
    setParsedData(updatedData);
    setJsonString(formatJson(updatedData));
  };

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-vison-bg">
      <div className="container px-4 py-8 mx-auto">
        <Header />
        <main className="flex flex-col gap-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-2">Shared JSON</h2>
          {error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
          ) : (
            <>
              <JsonInput onJsonChange={handleJsonChange} initialValue={jsonString} />
              <div className="flex justify-center gap-6 mb-6 animate-fade-in">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
                >
                  Back to Home
                </button>
              </div>
              <div className="view-container relative min-h-[200px]">
                <JsonTable
                  jsonData={parsedData}
                  isArray={isArray}
                  onDataChange={handleDataChange}
                />
                <JsonTreeView jsonData={parsedData} onDataChange={handleDataChange} />
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default SharePage;
