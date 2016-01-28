package com.ooyala.android.ooyalaskinsdk;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.os.CountDownTimer;
import android.text.TextPaint;
import android.text.TextUtils;
import android.view.View;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.UIManagerModule;

/**
 * Created by dkorobov on 1/13/16.
 */
public class CountdownView extends View {

    private Paint mainPaint;
    private Paint secondaryPaint;
    private Paint textPaint;
    private Paint backgroundPaint;

    private RectF rectF = new RectF();

    private float textSize;
    private int textColor;
    private int progress = 0;
    private int maxTimeSec;
    private int mainColor;
    private int secondaryColor;
    private int fillColor;
    private float strokeWidth;
    private String text = null;
    private String embedCode;

    public CountdownView(Context context) {
        super(context);
        initPaints();
    }

    private void initPaints() {
        textPaint = new TextPaint();
        textPaint.setColor(textColor);
        textPaint.setTextSize(textSize);
        textPaint.setAntiAlias(true);


        mainPaint = new Paint();
        mainPaint.setColor(mainColor);
        mainPaint.setStyle(Paint.Style.STROKE);
        mainPaint.setAntiAlias(true);
        mainPaint.setStrokeWidth(strokeWidth);
        mainPaint.setStyle(Paint.Style.STROKE);
        mainPaint.setStrokeCap(Paint.Cap.ROUND);

        secondaryPaint = new Paint();
        secondaryPaint.setColor(secondaryColor);
        secondaryPaint.setStyle(Paint.Style.STROKE);
        secondaryPaint.setAntiAlias(true);
        secondaryPaint.setStrokeWidth(strokeWidth);

        backgroundPaint = new Paint();
        backgroundPaint.setColor(fillColor);
        backgroundPaint.setAntiAlias(true);

    }

    public void setTextSize(float textSize) {
        this.textSize = textSize;
    }

    public void setTextColor(int textColor) {
        this.textColor = textColor;
    }

    public void setMainColor(int mainColor) {
        this.mainColor = mainColor;
    }

    public void setSecondaryColor(int secondaryColor) {
        this.secondaryColor = secondaryColor;
    }

    public void setFillColor(int fillColor) {
        this.fillColor = fillColor;
    }

    public void setStrokeWidth(float strokeWidth) {
        this.strokeWidth = strokeWidth;
    }

    @Override
    public void invalidate() {
        initPaints();
        super.invalidate();
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        rectF.set(strokeWidth, strokeWidth, MeasureSpec.getSize(widthMeasureSpec) - strokeWidth,
                MeasureSpec.getSize(heightMeasureSpec) - strokeWidth);
        setMeasuredDimension(widthMeasureSpec, heightMeasureSpec);
    }

    public void setMaxTimeSec(int maxTimeSec) {
        this.maxTimeSec = maxTimeSec;
        invalidate();
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setProgress(int progress) {
        this.progress = progress;
        invalidate();
    }

    private float getProgressAngle() {
        return progress / (float) maxTimeSec * 360f;
    }

    public void start() {

        new CountDownTimer((maxTimeSec - progress) * 1000, 100) {
            public void onTick(long millisUntilFinished) {
                int secUntilFinished = (int) (millisUntilFinished / 1000);
                setProgress(maxTimeSec - secUntilFinished);
                text = String.valueOf(secUntilFinished);
            }

            public void onFinish() {
                setVisibility(View.GONE);
                onReceiveNativeEvent();
            }

        }.start();
    }

    public void onReceiveNativeEvent() {
        ReactContext reactContext = (ReactContext)getContext();
        reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onTimerCompleted", embedCode);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        float backgroundRadius = (getWidth() - (2 * strokeWidth)) / 2f;
        canvas.drawCircle(getWidth() / 2.0f, getHeight() / 2.0f, backgroundRadius, backgroundPaint);

        canvas.drawArc(rectF, 0 + getProgressAngle(), 360 - getProgressAngle(), false, secondaryPaint);
        canvas.drawArc(rectF, 0, getProgressAngle(), false, mainPaint);

        if (!TextUtils.isEmpty(text)) {
            float textHeight = textPaint.descent() + textPaint.ascent();
            canvas.drawText(text, (getWidth() - textPaint.measureText(this.text)) / 2.0f, (getWidth() - textHeight) / 2.0f, textPaint);
        }
    }

    public void setEmbedCode(String embedCode) {
        this.embedCode = embedCode;
    }
}