import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Edit2, Trash2, ChevronRight, X, Check } from 'lucide-react';

export default function DepartmentBuilder() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept) {
      fetchQuestions(selectedDept._id);
    } else {
      setQuestions([]);
    }
  }, [selectedDept]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchQuestions = async (deptId) => {
    try {
      const res = await api.get(`/questions/department/${deptId}`);
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveDept = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      code: formData.get('code'),
      title: {
        en: formData.get('title'),
      },
      isActive: formData.get('isActive') === 'on'
    };

    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept._id}`, payload);
      } else {
        await api.post('/departments', payload);
      }
      setShowDeptModal(false);
      setEditingDept(null);
      fetchDepartments();
    } catch (err) {
      alert("Error saving department");
    }
  };

  const handleDeleteDept = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this department? This will not delete its questions, but they will be orphaned.")) return;
    try {
      await api.delete(`/departments/${id}`);
      if (selectedDept && selectedDept._id === id) setSelectedDept(null);
      fetchDepartments();
    } catch (err) {
      alert("Error deleting department");
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const type = formData.get('type');
    
    // Parse options for select types
    let options = [];
    if (type === 'singleSelect' || type === 'multiSelect') {
      const optsString = formData.get('options');
      if (optsString) {
        options = optsString.split(',').map(s => s.trim()).filter(Boolean).map(val => ({ label: val, value: val }));
      }
    }

    const payload = {
      departmentId: selectedDept._id,
      code: formData.get('code'),
      type: type,
      question: {
        en: formData.get('question'),
      },
      options: options,
      required: formData.get('required') === 'on',
      active: true,
      order: editingQuestion ? editingQuestion.order : questions.length + 1
    };

    try {
      if (editingQuestion) {
        await api.put(`/questions/${editingQuestion._id}`, payload);
      } else {
        await api.post('/questions', payload);
      }
      setShowQuestionModal(false);
      setEditingQuestion(null);
      fetchQuestions(selectedDept._id);
    } catch (err) {
      alert("Error saving question");
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!confirm("Delete this question?")) return;
    try {
      await api.delete(`/questions/${id}`);
      fetchQuestions(selectedDept._id);
    } catch (err) {
      alert("Error deleting question");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '24px' }}>
      
      {/* LEFT PANE: DEPARTMENTS */}
      <div className="admin-card" style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Departments</h2>
          <button className="btn btn-primary" style={{ padding: '6px 12px' }} onClick={() => {
            setEditingDept(null);
            setShowDeptModal(true);
          }}>
            <Plus size={16} /> Add
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
            {departments.map(dept => (
              <div 
                key={dept._id}
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${selectedDept?._id === dept._id ? 'var(--primary)' : 'var(--border)'}`,
                  background: selectedDept?._id === dept._id ? 'var(--primary-light)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{dept.title?.en}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{dept.code}</div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setEditingDept(dept);
                    setShowDeptModal(true);
                  }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={(e) => handleDeleteDept(dept._id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANE: QUESTIONS */}
      <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!selectedDept ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            Select a department to view questions
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>{selectedDept.title?.en} Questions</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{questions.length} questions in this department</p>
              </div>
              <button className="btn btn-primary" style={{ padding: '6px 12px' }} onClick={() => {
                setEditingQuestion(null);
                setShowQuestionModal(true);
              }}>
                <Plus size={16} /> Add Question
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
              {questions.map((q, i) => (
                <div key={q._id} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '12px' }}>
                          Q{i + 1}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{q.type}</span>
                        {q.required && <span style={{ fontSize: '12px', color: '#ef4444' }}>*Required</span>}
                      </div>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {q.question?.en}
                      </div>
                      {(q.type === 'singleSelect' || q.type === 'multiSelect') && q.options && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {q.options.map(opt => (
                            <span key={opt.value} style={{ fontSize: '12px', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                              {opt.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setEditingQuestion(q); setShowQuestionModal(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteQuestion(q._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {questions.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>No questions added yet.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* DEPARTMENT MODAL */}
      {showDeptModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="admin-card" style={{ width: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>{editingDept ? 'Edit' : 'Add'} Department</h3>
              <button onClick={() => setShowDeptModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveDept} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>Department Code</label>
                <input name="code" defaultValue={editingDept?.code} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} placeholder="e.g. HR, IT, OPS" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>Title (English)</label>
                <input name="title" defaultValue={editingDept?.title?.en} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} placeholder="e.g. Human Resources" />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <input type="checkbox" name="isActive" defaultChecked={editingDept ? editingDept.isActive : true} />
                <span style={{ fontSize: '14px' }}>Active</span>
              </label>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>Save Department</button>
            </form>
          </div>
        </div>
      )}

      {/* QUESTION MODAL */}
      {showQuestionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="admin-card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>{editingQuestion ? 'Edit' : 'Add'} Question</h3>
              <button onClick={() => setShowQuestionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>Question Code</label>
                <input name="code" defaultValue={editingQuestion?.code} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} placeholder="e.g. Q1" />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>Answer Type</label>
                <select name="type" defaultValue={editingQuestion?.type || 'text'} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                  <option value="text">Short Text</option>
                  <option value="textarea">Long Paragraph (Textarea)</option>
                  <option value="scale">Rating Scale (1-10)</option>
                  <option value="singleSelect">Single Select (Radio)</option>
                  <option value="multiSelect">Multiple Select (Checkboxes)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>Question Prompt</label>
                <textarea name="question" defaultValue={editingQuestion?.question?.en} required rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }} placeholder="Enter the question text here..." />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-secondary)' }}>Options (For Select Types)</label>
                <input name="options" defaultValue={editingQuestion?.options?.map(o => o.value).join(', ')} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} placeholder="e.g. Yes, No, Maybe (Comma separated)" />
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>Only applies if type is Single/Multi Select.</p>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <input type="checkbox" name="required" defaultChecked={editingQuestion ? editingQuestion.required : true} />
                <span style={{ fontSize: '14px' }}>Required Question</span>
              </label>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>Save Question</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
