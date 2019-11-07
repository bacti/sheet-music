package com.bacti.chipiano;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import android.Manifest;
import android.content.pm.PackageManager;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.Environment;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.util.concurrent.atomic.AtomicBoolean;
import org.cocos2dx.javascript.AppActivity;

public class AudioRecorder
{
    private static final int SAMPLING_RATE_IN_HZ = 44100;
    private static final int CHANNEL_CONFIG = AudioFormat.CHANNEL_IN_MONO;
    private static final int AUDIO_FORMAT = AudioFormat.ENCODING_PCM_FLOAT;
    // private static final int BUFFER_SIZE = 1024; // want to play 2048 (2K) since 2 bytes we use only 1024
    private static final int BUFFER_SIZE_FACTOR = 4; // 2 bytes in 16bit format
    private static final int BUFFER_SIZE = AudioRecord.getMinBufferSize(SAMPLING_RATE_IN_HZ, CHANNEL_CONFIG, AUDIO_FORMAT);
    private static final AtomicBoolean recordingInProgress = new AtomicBoolean(false);
    private static AudioRecord recorder = null;
    private static Thread recordingThread = null;

    public static void PrepareRecording(int SampleRate, int Channels, String AudioQuality, String AudioEncoding)
    {
        try
        {
            recorder = new AudioRecord(MediaRecorder.AudioSource.MIC,
                SAMPLING_RATE_IN_HZ,
                CHANNEL_CONFIG,
                AUDIO_FORMAT,
                BUFFER_SIZE * BUFFER_SIZE_FACTOR);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN)
            {
                if (android.media.audiofx.NoiseSuppressor.isAvailable())
                {
                    android.media.audiofx.NoiseSuppressor noiseSuppressor = android.media.audiofx.NoiseSuppressor.create(recorder.getAudioSessionId());
                    if (noiseSuppressor != null)
                    {
                        noiseSuppressor.setEnabled(true);
                    }
                }
                if (android.media.audiofx.AutomaticGainControl.isAvailable())
                {
                    android.media.audiofx.AutomaticGainControl automaticGainControl = android.media.audiofx.AutomaticGainControl.create(recorder.getAudioSessionId());
                    if (automaticGainControl != null)
                    {
                        automaticGainControl.setEnabled(true);
                    }
                }
            }
            AppActivity.OnNativeMessage("cc.OnPrepareRecording(true)");
        }
        catch (final Exception e)
        {
            e.printStackTrace();
            AppActivity.OnNativeMessage("cc.OnPrepareRecording(false)");
        }
    }

    public static void StartRecording()
    {
        try
        {
            recorder.startRecording();
            recordingInProgress.set(true);
            recordingThread = new Thread(new RecordingRunnable());
            recordingThread.start();
            AppActivity.OnNativeMessage("cc.OnStartRecording(true)");
        }
        catch (final Exception e)
        {
            e.printStackTrace();
            AppActivity.OnNativeMessage("cc.OnStartRecording(false)");
        }
    }

    public static void StopRecording()
    {
        try
        {
            recordingInProgress.set(false);
            // recorder.stop();
            // recorder.release();
            // recorder = null;
            // recordingThread = null;
            AppActivity.OnNativeMessage("cc.OnStopRecording(true)");
        }
        catch (final Exception e)
        {
            e.printStackTrace();
            AppActivity.OnNativeMessage("cc.OnStopRecording(false)");
        }
    }

    private static class RecordingRunnable implements Runnable
    {
        @Override
        public void run()
        {
            float buffer[] = new float[BUFFER_SIZE];
            try
            {
                while (recordingInProgress.get())
                {
                    int result = recorder.read(buffer, 0, BUFFER_SIZE, AudioRecord.READ_NON_BLOCKING);
                    if (result < 0)
                    {
                        throw new RuntimeException("Reading of audio buffer failed: " +
                                getBufferReadFailureReason(result));
                    }
                    float pitch = buffering(buffer, BUFFER_SIZE);
                    AppActivity.OnNativeMessage("cc.Log(" + pitch + ")");
                }
            }
            catch (Exception e)
            {
                throw new RuntimeException("Writing of recorded audio failed", e);
            }
        }

        private String getBufferReadFailureReason(int errorCode)
        {
            switch (errorCode)
            {
                case AudioRecord.ERROR_INVALID_OPERATION:
                    return "ERROR_INVALID_OPERATION";
                case AudioRecord.ERROR_BAD_VALUE:
                    return "ERROR_BAD_VALUE";
                case AudioRecord.ERROR:
                    return "ERROR";
                default:
                    return "Unknown (" + errorCode + ")";
            }
        }
    }

    public native static float buffering(float[] buffer, int bufferSize);
}
