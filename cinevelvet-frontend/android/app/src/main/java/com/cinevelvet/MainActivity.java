package com.cinevelvet;

import android.graphics.Color;
import android.graphics.Insets;
import android.graphics.drawable.GradientDrawable;
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

        int colorSuperior = Color.WHITE;
        int colorInferior = Color.WHITE;

        GradientDrawable gradient = new GradientDrawable(
                GradientDrawable.Orientation.TOP_BOTTOM,
                new int[]{colorSuperior, colorInferior}
        );

        getWindow().getDecorView().setBackground(gradient);

        // Cambiar color barra superior y poner iconos oscuros
        getWindow().setStatusBarColor(colorSuperior);
        // Ajustar visibilidad del texto de la barra de estado para que sea negro
        View decorView = getWindow().getDecorView();
        int flags = decorView.getSystemUiVisibility();
        flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        decorView.setSystemUiVisibility(flags);
    }

}
