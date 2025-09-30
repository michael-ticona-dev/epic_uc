import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { mockApi } from '../utils/mockApi';
import { format } from '../utils/format';
import { validators } from '../utils/validators';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const { showToast } = useUI();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Billing Info
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    
    // Payment Info
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Address
    address: '',
    city: '',
    postalCode: '',
    country: 'España'
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!validators.required(formData.firstName)) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!validators.required(formData.lastName)) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!validators.required(formData.email)) {
      newErrors.email = 'El email es requerido';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!validators.required(formData.address)) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!validators.required(formData.city)) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!validators.required(formData.postalCode)) {
      newErrors.postalCode = 'El código postal es requerido';
    }

    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!validators.required(formData.cardNumber)) {
      newErrors.cardNumber = 'El número de tarjeta es requerido';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
    }

    if (!validators.required(formData.expiryDate)) {
      newErrors.expiryDate = 'La fecha de vencimiento es requerida';
    }

    if (!validators.required(formData.cvv)) {
      newErrors.cvv = 'El CVV es requerido';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'El CVV debe tener al menos 3 dígitos';
    }

    if (!validators.required(formData.cardName)) {
      newErrors.cardName = 'El nombre en la tarjeta es requerido';
    }

    return newErrors;
  };

  const handleNextStep = () => {
    let stepErrors = {};
    
    if (currentStep === 1) {
      stepErrors = validateStep1();
    } else if (currentStep === 2) {
      stepErrors = validateStep2();
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    const step2Errors = validateStep2();
    if (Object.keys(step2Errors).length > 0) {
      setErrors(step2Errors);
      return;
    }

    setLoading(true);
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Crear orden
      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          gameId: item.gameId,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        total,
        billingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        }
      };

      await mockApi.createOrder(orderData);
      
      // Limpiar carrito
      clearCart();
      
      // Mostrar éxito
      setCurrentStep(4);
      showToast('¡Compra realizada con éxito!', 'success');
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/library');
      }, 3000);
      
    } catch (error) {
      showToast('Error al procesar el pago', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const steps = [
    { number: 1, title: 'Información de Facturación' },
    { number: 2, title: 'Método de Pago' },
    { number: 3, title: 'Confirmación' },
    { number: 4, title: 'Completado' }
  ];

  return (
    <MainLayout>
      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: 'var(--space-4)'
          }}>
            Finalizar Compra
          </h1>

          {/* Progress Steps */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)'
          }}>
            {steps.map((step, index) => (
              <div key={step.number} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: currentStep >= step.number ? 'var(--primary)' : 'var(--surface)',
                  color: currentStep >= step.number ? 'white' : 'var(--text-muted)',
                  border: `2px solid ${currentStep >= step.number ? 'var(--primary)' : 'var(--border)'}`,
                  fontWeight: '600'
                }}>
                  {currentStep > step.number ? <CheckCircle size={20} /> : step.number}
                </div>
                <span style={{ 
                  color: currentStep >= step.number ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: currentStep === step.number ? '600' : '400'
                }}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div style={{
                    width: '60px',
                    height: '2px',
                    background: currentStep > step.number ? 'var(--primary)' : 'var(--border)'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: 'var(--space-8)'
        }}>
          
          {/* Main Content */}
          <div className="card">
            {currentStep === 1 && (
              <div>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Información de Facturación</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input
                      name="firstName"
                      className="form-input"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && <div className="form-error">{errors.firstName}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Apellidos</label>
                    <input
                      name="lastName"
                      className="form-input"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && <div className="form-error">{errors.lastName}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Dirección</label>
                  <input
                    name="address"
                    className="form-input"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {errors.address && <div className="form-error">{errors.address}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label">Ciudad</label>
                    <input
                      name="city"
                      className="form-input"
                      value={formData.city}
                      onChange={handleChange}
                    />
                    {errors.city && <div className="form-error">{errors.city}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Código Postal</label>
                    <input
                      name="postalCode"
                      className="form-input"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                    {errors.postalCode && <div className="form-error">{errors.postalCode}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">País</label>
                    <select
                      name="country"
                      className="form-input"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="España">España</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Francia">Francia</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 style={{ 
                  marginBottom: 'var(--space-6)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <CreditCard size={24} />
                  Método de Pago
                </h2>
                
                <div className="form-group">
                  <label className="form-label">Número de Tarjeta</label>
                  <input
                    name="cardNumber"
                    className="form-input"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                  />
                  {errors.cardNumber && <div className="form-error">{errors.cardNumber}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label">Fecha de Vencimiento</label>
                    <input
                      name="expiryDate"
                      className="form-input"
                      placeholder="MM/AA"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                    {errors.expiryDate && <div className="form-error">{errors.expiryDate}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      name="cvv"
                      className="form-input"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                    />
                    {errors.cvv && <div className="form-error">{errors.cvv}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nombre en la Tarjeta</label>
                  <input
                    name="cardName"
                    className="form-input"
                    value={formData.cardName}
                    onChange={handleChange}
                  />
                  {errors.cardName && <div className="form-error">{errors.cardName}</div>}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-4)',
                  background: 'rgba(90, 169, 255, 0.1)',
                  border: '1px solid var(--primary)',
                  borderRadius: 'var(--radius)',
                  marginTop: 'var(--space-4)'
                }}>
                  <Lock size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>
                    Tu información de pago está protegida con encriptación SSL
                  </span>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Confirmar Pedido</h2>
                
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <h3 style={{ marginBottom: 'var(--space-4)' }}>Información de Facturación</h3>
                  <div style={{ 
                    padding: 'var(--space-4)',
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.875rem'
                  }}>
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.email}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.postalCode}</p>
                    <p>{formData.country}</p>
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <h3 style={{ marginBottom: 'var(--space-4)' }}>Método de Pago</h3>
                  <div style={{ 
                    padding: 'var(--space-4)',
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.875rem'
                  }}>
                    <p>**** **** **** {formData.cardNumber.slice(-4)}</p>
                    <p>{formData.cardName}</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <CheckCircle size={64} style={{ color: 'var(--success)', marginBottom: 'var(--space-4)' }} />
                <h2 style={{ marginBottom: 'var(--space-4)', color: 'var(--success)' }}>
                  ¡Compra Completada!
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>
                  Tu pedido ha sido procesado exitosamente. Los juegos ya están disponibles en tu biblioteca.
                </p>
                <div className="animate-pulse" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Redirigiendo a tu biblioteca en unos segundos...
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 'var(--space-8)',
                paddingTop: 'var(--space-6)',
                borderTop: '1px solid var(--border)'
              }}>
                <button
                  onClick={handlePreviousStep}
                  className="btn btn-ghost"
                  disabled={currentStep === 1}
                >
                  Anterior
                </button>
                
                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="btn btn-primary"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : 'Confirmar Compra'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Resumen del Pedido</h3>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              {items.map(item => (
                <div key={item.gameId} style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-2)',
                  fontSize: '0.875rem'
                }}>
                  <span>{item.title} x{item.quantity}</span>
                  <span>{format.currency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 'var(--space-4) 0' }} />
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.125rem',
              fontWeight: '700',
              color: 'var(--primary)'
            }}>
              <span>Total:</span>
              <span>{format.currency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}