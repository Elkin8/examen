// src/pages/LoginPage.tsx
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonText, IonList } from '@ionic/react';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from 'react-router';

const Login: React.FC = () => {
  const { loginWithCredentials } = useAuth();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const history = useHistory();

  const onSubmit = async () => {
    setErr(null);
    try {
      const ok = await loginWithCredentials(user, pass);
      if (!ok) {
        setErr('Usuario o contraseña incorrectos');
        return;
      }
      history.push('/attendance');
    } catch (e: any) {
      setErr(e.message ?? 'Error de login');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput
              label="Usuario"
              labelPlacement="stacked"
              value={user}
              onIonChange={e => setUser(e.detail.value ?? '')}
              placeholder="usuario"
            />
          </IonItem>
          <IonItem>
            <IonInput
              type="password"
              label="Contraseña"
              labelPlacement="stacked"
              value={pass}
              onIonChange={e => setPass(e.detail.value ?? '')}
              placeholder="********"
            />
          </IonItem>
        </IonList>
        {err && <IonText color="danger">{err}</IonText>}
        <IonButton expand="block" className="ion-margin-top" onClick={onSubmit}>
          Entrar
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
