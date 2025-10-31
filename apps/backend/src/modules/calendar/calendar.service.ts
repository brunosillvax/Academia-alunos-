import { Injectable } from '@nestjs/common';

@Injectable()
export class CalendarService {
  // Integração básica com Google Calendar API
  // Em produção, usar @google-cloud/calendar ou googleapis

  async syncScheduleToGoogleCalendar(scheduleData: {
    title: string;
    startTime: Date;
    endTime: Date;
    description?: string;
    location?: string;
  }) {
    // Gera URL do Google Calendar para adicionar evento
    const start = scheduleData.startTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = scheduleData.endTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: scheduleData.title,
      dates: `${start}/${end}`,
      details: scheduleData.description || '',
      location: scheduleData.location || '',
    });

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;

    return {
      url: googleCalendarUrl,
      message: 'Clique no link para adicionar ao Google Calendar',
    };
  }

  async exportScheduleAsICS(schedules: Array<{
    title: string;
    startTime: Date;
    endTime: Date;
    description?: string;
    location?: string;
  }>) {
    // Gerar arquivo ICS (iCalendar) para importação
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//GymFlow//EN\n';

    schedules.forEach((schedule) => {
      ics += 'BEGIN:VEVENT\n';
      ics += `DTSTART:${formatICSDate(schedule.startTime)}\n`;
      ics += `DTEND:${formatICSDate(schedule.endTime)}\n`;
      ics += `SUMMARY:${schedule.title}\n`;
      if (schedule.description) ics += `DESCRIPTION:${schedule.description}\n`;
      if (schedule.location) ics += `LOCATION:${schedule.location}\n`;
      ics += 'END:VEVENT\n';
    });

    ics += 'END:VCALENDAR';

    return ics;
  }

  // TODO: Implementar autenticação OAuth2 e sincronização bidirecional
  // async authenticateWithGoogle() { ... }
  // async syncFromGoogleCalendar() { ... }
}

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
