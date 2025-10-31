import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { StudentModule } from './modules/student/student.module';
import { ModalityModule } from './modules/modality/modality.module';
import { PlanModule } from './modules/plan/plan.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PushModule } from './modules/push/push.module';
import { CalendarModule } from './modules/calendar/calendar.module';

@Module({
  imports: [AuthModule, AdminModule, StudentModule, ModalityModule, PlanModule, ScheduleModule, AnalyticsModule, HealthModule, CampaignModule, PaymentModule, PushModule, CalendarModule],
  providers: [PrismaService],
})
export class AppModule {}
