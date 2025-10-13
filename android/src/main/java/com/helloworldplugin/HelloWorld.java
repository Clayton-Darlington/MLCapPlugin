package com.helloworldplugin;

import android.util.Log;

public class HelloWorld {

    public String echo(String value) {
        Log.i("HelloWorld", "Echo called with: " + value);
        return value;
    }

    public String getGreeting(String name) {
        String greeting = "Hello " + name + " from Android!";
        Log.i("HelloWorld", "Greeting: " + greeting);
        return greeting;
    }
}