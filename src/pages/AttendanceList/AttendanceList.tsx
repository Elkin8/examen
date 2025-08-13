import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonText, IonButton
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AttendanceItem, listAttendance } from '../../../../ExamenIonic/src/api/examen';
import { useHistory } from 'react-router';

const AttendanceList: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [items, setItems] = useState<AttendanceItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      history.replace('/login');
      return;
    }
    (async () => {
      setError(null);
      try {
        const data = await listAttendance(user.record);
        setItems(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'No se pudo cargar la asistencia');
      }
    })();
  }, [user, history]);

  if (!user) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi asistencia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error && <IonText color="danger">{error}</IonText>}
        {!error && items.length === 0 && <IonText>No hay registros.</IonText>}

        <IonList>
          {items.map((it, idx) => (
            <IonItem key={idx}>
              <IonLabel>
                <h2>{it.date} {it.time}</h2>
                <p>join_user: {it.join_user}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonButton expand="block" className="ion-margin-top" onClick={() => history.push('/attendance')}>
          Volver
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AttendanceList;
