package com.cinevelvet;

import android.graphics.Color;
import android.graphics.Insets;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsets.Type;

import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(android.graphics.Color.TRANSPARENT);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            View decorView = getWindow().getDecorView();
            decorView.setOnApplyWindowInsetsListener((v, insets) -> {
                Insets systemBarsInsets = insets.getInsets(Type.systemBars());
                v.setPadding(0, systemBarsInsets.top, 0, systemBarsInsets.bottom);
                return WindowInsets.CONSUMED;
            });
        }

        int colorSuperior = ContextCompat.getColor(this, com.getcapacitor.android.R.color.colorCinemaVelvet);

        int colorInferior = Color.WHITE;

        GradientDrawable gradient = new GradientDrawable(
                GradientDrawable.Orientation.TOP_BOTTOM,
                new int[]{colorSuperior, colorInferior}
        );

        // Establece el fondo en la vista raíz
        getWindow().getDecorView().setBackground(gradient);
    }
}
