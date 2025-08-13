import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { registerAttendance } from '../../../../ExamenIonic/src/api/examen';
import { useHistory } from 'react-router';

function pickTwoPositions(len: number): [number, number] {
  const a = Math.floor(Math.random() * len) + 1;
  let b = Math.floor(Math.random() * len) + 1;
  while (b === a) b = Math.floor(Math.random() * len) + 1;
  return a < b ? [a, b] : [b, a];
}

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const history = useHistory();

  const [identification, setIdentification] = useState('');
  const [positions, setPositions] = useState<[number, number] | null>(null);

  const [digitA, setDigitA] = useState('');
  const [digitB, setDigitB] = useState('');

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) history.replace('/login');
  }, [user, history]);

  const canGenerateChallenge = useMemo(() => identification.trim().length >= 6, [identification]);

  const generateChallenge = () => {
    setStatus(null);
    setError(null);
    if (!canGenerateChallenge) {
      setError('Ingresa una identificación válida (mínimo 6 dígitos).');
      return;
    }
    setPositions(pickTwoPositions(identification.length));
    setDigitA('');
    setDigitB('');
  };

  const onRegister = async () => {
    if (!user || !positions) return;
    setError(null);
    setStatus(null);

    const [p1, p2] = positions;

    const realA = identification[p1 - 1];
    const realB = identification[p2 - 1];
    if (digitA !== realA || digitB !== realB) {
      setError('Los dígitos no coinciden con la identificación.');
      return;
    }

    const join_user = `${digitA}${digitB}`;

    try {
      const resp = await registerAttendance(user.record, join_user);
      setStatus(resp.message ?? 'Asistencia registrada');
    } catch (e: any) {
      setError(e.message ?? 'No se pudo registrar la asistencia.');
    }
  };

  if (!user) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registrar asistencia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Hola, {user.names} {user.lastnames}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonInput
                type="text"
                inputmode="numeric"
                label="Número de identificación"
                labelPlacement="stacked"
                value={identification}
                onIonChange={e => setIdentification((e.detail.value ?? '').replace(/\D/g, ''))}
                placeholder="Ingresa tu cédula/ID"
              />
            </IonItem>
            <IonButton
              className="ion-margin-top"
              expand="block"
              onClick={generateChallenge}
              disabled={!canGenerateChallenge}
            >
              Generar desafío (2 dígitos)
            </IonButton>

            {positions && (
              <>
                <IonText className="ion-margin-top" color="primary">
                  Ingresa el dígito de la posición <b>{positions[0]}</b> y el de la posición <b>{positions[1]}</b> de tu identificación.
                </IonText>
                <IonItem className="ion-margin-top">
                  <IonInput
                    type="text"
                    inputmode="numeric"
                    maxlength={1}
                    label={`Dígito pos ${positions[0]}`}
                    labelPlacement="stacked"
                    value={digitA}
                    onIonChange={e => setDigitA((e.detail.value ?? '').replace(/\D/g, '').slice(0, 1))}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    type="text"
                    inputmode="numeric"
                    maxlength={1}
                    label={`Dígito pos ${positions[1]}`}
                    labelPlacement="stacked"
                    value={digitB}
                    onIonChange={e => setDigitB((e.detail.value ?? '').replace(/\D/g, '').slice(0, 1))}
                  />
                </IonItem>

                <IonButton className="ion-margin-top" expand="block" onClick={onRegister} disabled={!digitA || !digitB}>
                  Registrar asistencia
                </IonButton>
              </>
            )}

            {status && <IonText color="success" className="ion-margin-top">{status}</IonText>}
            {error && <IonText color="danger" className="ion-margin-top">{error}</IonText>}

            <IonButton fill="outline" color="medium" className="ion-margin-top" expand="block" onClick={() => history.push('/attendance/list')}>
              Ver mi asistencia
            </IonButton>
            <IonButton fill="clear" color="danger" className="ion-margin-top" expand="block" onClick={logout}>
              Cerrar sesión
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
