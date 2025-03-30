package com.nexopdv.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.Handler;

public class SplashActivity extends Activity {
    private static final int SPLASH_DISPLAY_TIME = 2000; // 2 segundos

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                if (isNetworkAvailable()) {
                    // Se houver conexão com a internet, inicia a MainActivity
                    Intent mainIntent = new Intent(SplashActivity.this, MainActivity.class);
                    startActivity(mainIntent);
                    finish();
                } else {
                    // Se não houver conexão com a internet, inicia a NoConnectionActivity
                    Intent noConnectionIntent = new Intent(SplashActivity.this, NoConnectionActivity.class);
                    startActivity(noConnectionIntent);
                    finish();
                }
            }
        }, SPLASH_DISPLAY_TIME);
    }

    // Método para verificar se há conexão com a internet
    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }
}
