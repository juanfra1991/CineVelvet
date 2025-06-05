package com.cinevelvet;

import android.graphics.Insets;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsets.Type;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            View decorView = getWindow().getDecorView();
            decorView.setOnApplyWindowInsetsListener((v, insets) -> {
                Insets systemBarsInsets = insets.getInsets(Type.systemBars());
                v.setPadding(0, systemBarsInsets.top, 0, systemBarsInsets.bottom);
                return WindowInsets.CONSUMED;
            });
        }
        // Ajustar visibilidad del texto de la barra de estado para que sea negro
        View decorView = getWindow().getDecorView();
        int flags = decorView.getSystemUiVisibility();
        flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        decorView.setSystemUiVisibility(flags);
    }
}
