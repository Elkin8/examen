import React, { useEffect, useState } from 'react';
import {
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonList, 
  IonItem, 
  IonText, 
  IonSpinner, 
  IonButton, 
  IonNote,
  IonIcon,
  IonBadge,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { 
  calendarOutline, 
  timeOutline, 
  refreshOutline, 
  listOutline,
  checkmarkCircleOutline,
  documentTextOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import { AttendanceItem, listAttendance } from '../api/examen';
import { useAuth } from '../context/AuthContext';
import './AttendanceList.css';

interface AttendanceListProps {
  refreshTrigger?: number;
}

const AttendanceList: React.FC<AttendanceListProps> = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<AttendanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAttendance = async () => {
  if (!user) return;
  setIsLoading(true);
  setError(null);
  try {
    console.log("Fetching attendance...");
    const data = await listAttendance(user.record);
    console.log("Data received:", data);
    setItems(data);
  } catch (e: unknown) {
    console.error(e);
    if (e instanceof Error) {
      setError(e.message);
    } else {
      setError('No se pudo cargar la asistencia');
    }
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    loadAttendance();
  }, [user, refreshTrigger]);

  const handleRefresh = async (event: CustomEvent) => {
    await loadAttendance();
    event.detail.complete();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const getTimeColor = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 15 && hour <= 18) return 'success';
    if (hour > 18 && hour <= 21) return 'warning';
    return 'danger';
  };

  if (!user) return null;

  return (
    <IonCard className="attendance-card">
      <IonCardHeader>
        <IonCardTitle>
          Historial de Asistencia
        </IonCardTitle>
      </IonCardHeader>
      
      <IonCardContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Estado de carga */}
        {isLoading && (
          <div className="loading-state">
            <IonSpinner name="crescent" color="primary" />
            <IonText color="medium">
              <p>Cargando registros...</p>
            </IonText>
          </div>
        )}

        {error && !isLoading && (
          <div className="error-state">
            <IonIcon icon={documentTextOutline} size="large" color="medium" />
            <IonText color="danger">
              <h3>Error al cargar</h3>
              <p>{error}</p>
            </IonText>
            <IonButton fill="outline" onClick={loadAttendance} size="small">
              Reintentar
            </IonButton>
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="empty-state">
            <IonIcon icon={listOutline} size="large" color="medium" />
            <IonText color="medium">
              <h3>Sin registros</h3>
              <p>Aún no tienes registros de asistencia.</p>
            </IonText>
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <>
            <IonList className="attendance-list">
              {items.map((item) => (
                <IonItemSliding key={item.record}>
                  <IonItem className="attendance-item">
                    <div className="attendance-content" slot="start">
                      <div className="attendance-header">
                        <div className="date-section">
                          <IonIcon icon={calendarOutline} color="primary" />
                          <span className="date-text">{formatDate(item.date)}</span>
                        </div>
                        <IonBadge color={getTimeColor(item.time)} className="time-badge">
                          <IonIcon icon={timeOutline} />
                          {formatTime(item.time)}
                        </IonBadge>
                      </div>
                      
                      <div className="attendance-details">
                        <IonNote>
                          Registro completo: {item.join_date}
                        </IonNote>
                        <IonNote className="record-id">
                          ID: #{item.record}
                        </IonNote>
                      </div>
                    </div>
                    
                    <IonIcon 
                      icon={chevronForwardOutline} 
                      color="medium" 
                      slot="end" 
                      className="chevron-icon"
                    />
                  </IonItem>
                  
                  <IonItemOptions>
                    <IonItemOption color="light">
                      <IonIcon icon={documentTextOutline} />
                      Ver detalles
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
            </IonList>
          </>
        )}

        <div className="update-section">
          <IonButton
            expand="block"
            fill="outline"
            onClick={loadAttendance}
            disabled={isLoading}
            className="update-btn"
          >
            {isLoading ? (
              <>
                <IonSpinner name="crescent" />
                <span style={{ marginLeft: '8px' }}>Actualizando...</span>
              </>
            ) : (
              <>
                <IonIcon icon={refreshOutline} slot="start" />
                Actualizar registros
              </>
            )}
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default AttendanceList;