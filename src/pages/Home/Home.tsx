/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonAlert,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonIcon,
  IonBadge,
  IonNote,
  IonAvatar,
  IonChip
} from '@ionic/react';
import { 
  logOutOutline, 
  personCircleOutline, 
  mailOutline, 
  idCardOutline,
  checkmarkCircleOutline,
  shieldCheckmarkOutline,
  refreshOutline
} from 'ionicons/icons';
import { useAuth } from '../../context/AuthContext';
import { registerAttendance } from '../../api/examen';
import AttendanceList from '../../components/AttendanceList';
import { useHistory } from 'react-router';
import './Home.css';

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const history = useHistory();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>(['', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertHeader, setAlertHeader] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
  if (user && user.id) {
    generateRandomNumbers(user.id.toString());
  }
}, [user]);


  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
      history.replace('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const generateRandomNumbers = (userId: string) => {
    if (!userId) return;

    const idLength = userId.length;
    if (idLength < 2) {
      setAlertHeader('Error');
      setAlertMessage('El ID debe tener al menos 2 dígitos');
      setShowAlert(true);
      return;
    }

    const position1 = Math.floor(Math.random() * idLength);
    let position2 = Math.floor(Math.random() * idLength);

    while (position2 === position1 && idLength > 1) {
      position2 = Math.floor(Math.random() * idLength);
    }

    setRandomNumbers([position1, position2]);
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value.replace(/[^0-9]/g, ''); // Solo números
    setUserInputs(newInputs);
  };

  const validateInputs = (): boolean => {
  if (!user || randomNumbers.length !== 2) return false;

  const userIdStr = user.id.toString(); // <-- convertimos a string

  for (let i = 0; i < 2; i++) {
    const expectedDigit = userIdStr[randomNumbers[i]];
    if (userInputs[i] !== expectedDigit) {
      setAlertHeader('Error de Validación');
      setAlertMessage(`El dígito en la posición ${randomNumbers[i] + 1} es incorrecto`);
      setShowAlert(true);
      return false;
    }
  }
  return true;
};


  const registerAttendanceHandler = async () => {
    if (!validateInputs()) return;
    setIsLoading(true);

    try {
  await registerAttendance(user!.record, userInputs.join(''));
  setAlertHeader('¡Perfecto!');
  setAlertMessage('Asistencia registrada correctamente');
  setShowAlert(true);

  setUserInputs(['', '']);
  generateRandomNumbers(user!.id.toString()); // <-- corregido
  setRefreshKey(k => k + 1);
} catch (error: unknown) {
  setAlertHeader('Error');
  if (error instanceof Error) {
    setAlertMessage(error.message);
  } else {
    setAlertMessage('Error al registrar asistencia');
  }
  setShowAlert(true);
} finally {
  setIsLoading(false);
}


  };

  const generateNewChallenge = () => {
  if (user?.id) {
    generateRandomNumbers(user.id.toString());
    setUserInputs(['', '']);
  }
};


  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Registro de Asistencia</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setConfirmLogout(true)} fill="clear">
                <IonIcon slot="start" icon={logOutOutline} />
                Salir
              </IonButton>
            </IonButtons>
            
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="error-state">
            <IonIcon icon={personCircleOutline} size="large" color="medium" />
            <IonText color="danger">
              <h2>Sin datos de usuario</h2>
              <p>No se encontraron datos de usuario. Por favor, inicia sesión nuevamente.</p>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Registra tu Asistencia</IonTitle>
          <IonButtons slot="end">
            <IonButton 
              onClick={() => setConfirmLogout(true)} 
              fill="clear" 
              color="primary" 
              className="logout-btn"
            >
              <IonIcon slot="start" icon={logOutOutline} />
              Salir
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="home-content">
        <div className="user-welcome">
          <div className="welcome-content">
            <IonAvatar className="user-avatar">
              <img src="../../public/assets/login.png" alt="Usuario" />
            </IonAvatar>
            <div className="welcome-text">
              <h1>¡Hola, {user.names?.split(' ')[0]}!</h1>
              <p>{getCurrentDate()}</p>
            </div>
          </div>
        </div>

        <div className="content-container">

            {/* Tarjeta de verificación */}
            <IonCard className="verification-card">
              <IonCardHeader>
                <IonCardTitle>
                  Registro de Asistencia
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonItem className="verification-input">
                        <IonInput
                          type="tel"
                          maxlength={1}
                          value={userInputs[0]}
                          onIonInput={(e) => handleInputChange(0, e.detail.value!)}
                          className="digit-input"
                          placeholder={`${randomNumbers[0] + 1}`} // muestra el número de posición
                        />
                      </IonItem>
                    </IonCol>
                    <IonCol>
                      <IonItem className="verification-input">
                        <IonInput
                          type="tel"
                          maxlength={1}
                          value={userInputs[1]}
                          onIonInput={(e) => handleInputChange(1, e.detail.value!)}
                          className="digit-input"
                          placeholder={`${randomNumbers[1] + 1}`} // muestra el número de posición
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                <IonButton
                  expand="block"
                  onClick={registerAttendanceHandler}
                  disabled={isLoading || userInputs.some(input => input === '')}
                  className="register-btn"
                  color="success"
                >
                  {isLoading ? (
                    <>
                      <IonSpinner name="crescent" />
                      <span style={{ marginLeft: '8px' }}>Registrando...</span>
                    </>
                  ) : (
                    'Registrar Asistencia'
                  )}
                </IonButton>
              </IonCardContent>
            </IonCard>


          <AttendanceList refreshTrigger={refreshKey} />
        </div>

        {/* Alerts */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={alertHeader}
          message={alertMessage}
          buttons={['Entendido']}
          cssClass={alertHeader === '¡Perfecto!' ? 'success-alert' : ''}
        />

        <IonAlert
          isOpen={confirmLogout}
          header="Cerrar sesión"
          message="¿Seguro que quieres salir de tu cuenta?"
          buttons={[
            { 
              text: 'Cancelar', 
              role: 'cancel', 
              handler: () => setConfirmLogout(false),
              cssClass: 'alert-cancel'
            },
            { 
              text: 'Salir', 
              role: 'destructive', 
              handler: handleLogout,
              cssClass: 'alert-confirm'
            }
          ]}
          onDidDismiss={() => setConfirmLogout(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;