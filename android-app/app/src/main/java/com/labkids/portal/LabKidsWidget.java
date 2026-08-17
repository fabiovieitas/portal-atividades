package com.labkids.portal;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

/**
 * Widget de Tela Inicial estilo Duolingo para o Lab Kids 🤖
 */
public class LabKidsWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.lab_kids_widget);

        // Define intent de clique no botão "JOGAR" para abrir o portal no navegador/app
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://portal-atividades.onrender.com/"));
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.btn_widget_play, pendingIntent);
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent);

        // Atualiza a view no Android
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
