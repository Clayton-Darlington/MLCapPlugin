package com.helloworldplugin;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "HelloWorld")
public class HelloWorldPlugin extends Plugin {

    private HelloWorld implementation = new HelloWorld();

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", implementation.echo(value));
        call.resolve(ret);
    }

    @PluginMethod
    public void getGreeting(PluginCall call) {
        String name = call.getString("name", "World");

        JSObject ret = new JSObject();
        ret.put("greeting", implementation.getGreeting(name));
        call.resolve(ret);
    }
}