import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'analyst',
    department: '',
    status: 'active'
  });

  // Load users from localStorage or initialize with some default users
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with some default users
      const defaultUsers = [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@spectra.gov',
          role: 'administrator',
          department: 'Cybercrime Division',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Senior Analyst',
          email: 'senior.analyst@spectra.gov',
          role: 'senior-analyst',
          department: 'Intelligence Unit',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    
    const userToAdd = {
      ...newUser,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      role: 'analyst',
      department: '',
      status: 'active'
    });
    setShowAddForm(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const handleToggleStatus = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <div style={{ 
      padding: 20, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0a0f1a 0%, #0c1422 100%)',
      color: 'white',
      fontFamily: 'var(--font-mono, monospace)'
    }}>
      <div style={{ 
        fontFamily: 'var(--font-mono)', 
        color: 'var(--accent-primary)', 
        marginBottom: 20,
        fontSize: '1.2em'
      }}>
        User Management — Security Personnel ({users.length} members)
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 20 
      }}>
        <div style={{ color: '#00ffb3', fontSize: '0.9em' }}>
          Manage law enforcement personnel and access permissions
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(45deg, #00d9ff, #0099ff)',
            color: 'black',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontWeight: 'bold',
            fontSize: '0.9em'
          }}
        >
          {showAddForm ? 'Cancel' : 'Add New Member'}
        </button>
      </div>

      {showAddForm && (
        <div style={{
          marginBottom: 20,
          padding: 15,
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px'
        }}>
          <h3 style={{ 
            color: '#00d9ff', 
            marginBottom: 15,
            fontFamily: 'var(--font-mono)'
          }}>
            Add New Personnel
          </h3>
          <form onSubmit={handleAddUser} style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.8em', 
                  color: '#00d9ff', 
                  marginBottom: '5px' 
                }}>
                  FULL NAME *
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    borderRadius: '4px',
                    color: 'white',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.9em'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.8em', 
                  color: '#00d9ff', 
                  marginBottom: '5px' 
                }}>
                  EMAIL *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    borderRadius: '4px',
                    color: 'white',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.9em'
                  }}
                  required
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.8em', 
                  color: '#00d9ff', 
                  marginBottom: '5px' 
                }}>
                  ROLE
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    borderRadius: '4px',
                    color: 'white',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.9em'
                  }}
                >
                  <option value="analyst">Analyst</option>
                  <option value="senior-analyst">Senior Analyst</option>
                  <option value="investigator">Investigator</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.8em', 
                  color: '#00d9ff', 
                  marginBottom: '5px' 
                }}>
                  DEPARTMENT
                </label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(0, 217, 255, 0.2)',
                    borderRadius: '4px',
                    color: 'white',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.9em'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(45deg, #00d9ff, #0099ff)',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 'bold',
                  fontSize: '0.9em'
                }}
              >
                Add Personnel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ 
        flex: 1, 
        background: 'rgba(0,0,0,0.6)', 
        border: '1px solid var(--border-color)', 
        padding: 15, 
        overflowY: 'auto',
        borderRadius: '4px'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontFamily: 'Courier New, monospace',
          fontSize: '0.9em'
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(0, 217, 255, 0.3)' }}>
              <th style={{ textAlign: 'left', padding: '8px', color: '#00d9ff' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '8px', color: '#00d9ff' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '8px', color: '#00d9ff' }}>Role</th>
              <th style={{ textAlign: 'left', padding: '8px', color: '#00d9ff' }}>Department</th>
              <th style={{ textAlign: 'left', padding: '8px', color: '#00d9ff' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '8px', color: '#00d9ff' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr 
                key={user.id} 
                style={{ 
                  borderBottom: '1px solid rgba(0, 217, 255, 0.1)',
                  background: user.id === currentUser?.id ? 'rgba(0, 217, 255, 0.1)' : 'transparent'
                }}
              >
                <td style={{ padding: '8px', color: '#00ff9c' }}>
                  {user.name} {user.id === currentUser?.id && '(You)'}
                </td>
                <td style={{ padding: '8px', color: '#00ff9c' }}>{user.email}</td>
                <td style={{ padding: '8px', color: '#00d9ff' }}>
                  {user.role.replace('-', ' ').toUpperCase()}
                </td>
                <td style={{ padding: '8px', color: '#00ff9c' }}>{user.department}</td>
                <td style={{ padding: '8px' }}>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '12px',
                    fontSize: '0.8em',
                    background: user.status === 'active' ? 'rgba(0, 255, 156, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                    color: user.status === 'active' ? '#00ff9c' : '#ff6b6b'
                  }}>
                    {user.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '8px' }}>
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    style={{
                      padding: '4px 8px',
                      marginRight: '8px',
                      background: user.status === 'active' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(0, 255, 156, 0.2)',
                      color: user.status === 'active' ? '#ff6b6b' : '#00ff9c',
                      border: '1px solid rgba(0, 217, 255, 0.2)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8em'
                    }}
                  >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  {user.id !== currentUser?.id && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{
                        padding: '4px 8px',
                        background: 'rgba(255, 107, 107, 0.2)',
                        color: '#ff6b6b',
                        border: '1px solid rgba(255, 107, 107, 0.2)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8em'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#aaa',
            fontStyle: 'italic'
          }}>
            No personnel registered. Add new members to the team.
          </div>
        )}
      </div>
      
      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        background: 'rgba(0, 0, 0, 0.4)', 
        border: '1px solid rgba(0, 217, 255, 0.2)',
        borderRadius: '4px',
        fontSize: '0.9em'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Total Members: {users.length}</div>
          <div>Active: {users.filter(u => u.status === 'active').length}</div>
          <div>Inactive: {users.filter(u => u.status === 'inactive').length}</div>
        </div>
      </div>
    </div>
  );
}