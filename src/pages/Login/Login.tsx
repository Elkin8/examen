import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonText, 
  IonCard,
  IonCardContent,
  IonIcon,
  IonSpinner,
  IonAlert
} from '@ionic/react';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from 'react-router';
import { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import './Login.css';

const Login: React.FC = () => {
  const { loginWithCredentials } = useAuth();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  // Validaciones
  const isUserValid = user.trim().length >= 3;
  const isPassValid = pass.length >= 6;
  const isFormValid = isUserValid && isPassValid;

  const onSubmit = async () => {
    if (!isFormValid) {
      setErr('Por favor completa todos los campos correctamente');
      return;
    }

    setErr(null);
    setLoading(true);
    
    try {
      const ok = await loginWithCredentials(user.trim(), pass);
      if (!ok) {
        setErr('Usuario o contraseña incorrectos');
        setShowAlert(true);
        return;
      }
      history.push('/attendance');
    } catch (e: any) {
      setErr(e.message ?? 'Error de conexión. Intenta nuevamente.');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

 const handleKeyPress = (event: React.KeyboardEvent<HTMLIonInputElement>) => {
  if (event.key === 'Enter' && isFormValid) {
    onSubmit();
  }
};



  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Bienvenido</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="login-content">
        <div className="login-container">
          
          <div className="login-header">
            <div className="login-logo">
              <img src="../../public/assets/login.png" alt="Perfil" className="profile-img" />
            </div>
            <h1>Iniciar Sesión</h1>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <IonCard className="login-card">
            <IonCardContent>

              <IonItem 
                lines="none" 
                className={`login-input ${!isUserValid && user.length > 0 ? 'ion-invalid' : ''}`}
              >
                <IonInput
                  label="Usuario"
                  labelPlacement="stacked"
                  value={user}
                  onIonInput={e => setUser(e.detail.value ?? '')}
                  onKeyUp={handleKeyPress} 
                  placeholder="Ingresa tu usuario"
                  fill="outline"
                  maxlength={20} // Máximo 20 caracteres
                  clearInput={false} // Quitar el botón de limpiar
                />
              </IonItem>

              {!isUserValid && user.length > 0 && (
                <IonText color="danger" className="error-text">
                  <small>El usuario debe tener al menos 3 caracteres</small>
                </IonText>
              )}

              <IonItem 
                lines="none" 
                className={`login-input ${!isPassValid && pass.length > 0 ? 'ion-invalid' : ''}`}
              >
                <IonInput
                  type="password"
                  label="Contraseña"
                  labelPlacement="stacked"
                  value={pass}
                  onIonInput={e => setPass(e.detail.value ?? '')}
                  onKeyDown={handleKeyPress}
                  placeholder="Ingresa tu contraseña"
                  fill="outline"
                  maxlength={10} // Máximo 10 caracteres
                />
              </IonItem>

              <IonButton 
                expand="block" 
                className="login-button"
                onClick={onSubmit}
                disabled={!isFormValid || loading}
                color="primary"
              >
                {loading ? (
                  <>
                    <IonSpinner name="crescent" />
                    <span style={{ marginLeft: '8px' }}>Iniciando...</span>
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </IonButton>

            </IonCardContent>

          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Error de autenticación"
          message={err || 'Ha ocurrido un error inesperado'}
          buttons={['Entendido']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;