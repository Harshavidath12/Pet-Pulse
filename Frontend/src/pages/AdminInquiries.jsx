import { useState, useEffect } from 'react';
import api from '../api';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const fetchInquiries = async () => {
    try {
      const { data } = await api.get('/api/admin/inquiries');
      setInquiries(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage) return;

    setReplyLoading(true);
    try {
      const { data } = await api.post(`/api/admin/inquiries/${selectedInquiry._id}/reply`, { replyMessage });
      
      // Update local state
      setInquiries(inquiries.map(inq => inq._id === data._id ? data : inq));
      setSelectedInquiry(null);
      setReplyMessage('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '100px 24px', textAlign: 'center' }}>Loading inquiries...</div>;
  if (error) return <div style={{ padding: '100px 24px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '32px' }}>Admin Inbox</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* Inbox List */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Inquiries</h2>
          {inquiries.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No inquiries found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {inquiries.map(inq => (
                <div 
                  key={inq._id}
                  onClick={() => setSelectedInquiry(inq)}
                  style={{ 
                    padding: '16px', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: `1px solid ${selectedInquiry?._id === inq._id ? 'var(--green-forest)' : '#e2e8f0'}`,
                    background: selectedInquiry?._id === inq._id ? '#f0fdf4' : 'white',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong>{inq.name}</strong>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      background: inq.status === 'replied' ? '#dcfce7' : '#fef3c7',
                      color: inq.status === 'replied' ? '#166534' : '#92400e'
                    }}>
                      {inq.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {inq.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details / Reply View */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          {selectedInquiry ? (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Message from {selectedInquiry.name}</h2>
              <a href={`mailto:${selectedInquiry.email}`} style={{ color: 'var(--green-forest)', textDecoration: 'none', marginBottom: '24px', display: 'inline-block' }}>
                {selectedInquiry.email}
              </a>

              <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '32px', lineHeight: '1.6' }}>
                {selectedInquiry.message}
              </div>

              {selectedInquiry.status === 'replied' ? (
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--green-forest)' }}>Your Reply</h3>
                  <div style={{ padding: '24px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', lineHeight: '1.6' }}>
                    {selectedInquiry.adminReply}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReplySubmit}>
                  <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Send a Reply</h3>
                  <textarea
                    rows="6"
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    placeholder="Type your response here. It will be emailed to the user..."
                    required
                    style={{
                      width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', 
                      fontFamily: 'inherit', marginBottom: '16px', resize: 'vertical'
                    }}
                  ></textarea>
                  <button type="submit" className="btn btn-primary" disabled={replyLoading}>
                    {replyLoading ? 'Sending...' : 'Send Reply'}
                  </button>
                </form>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              Select an inquiry from the inbox to view details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
