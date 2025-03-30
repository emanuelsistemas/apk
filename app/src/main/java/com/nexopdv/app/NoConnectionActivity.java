package com.nexopdv.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class NoConnectionActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_no_connection);

        Button retryButton = findViewById(R.id.retry_button);
        retryButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                checkConnection();
            }
        });
    }

    private void checkConnection() {
        if (isNetworkAvailable()) {
            // Se houver conexão com a internet, inicia a MainActivity
            Intent mainIntent = new Intent(NoConnectionActivity.this, MainActivity.class);
            startActivity(mainIntent);
            finish();
        } else {
            // Se ainda não houver conexão, mostra uma mensagem
            // Aqui você poderia mostrar um Toast ou um Snackbar
        }
    }

    // Método para verificar se há conexão com a internet
    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }
}
