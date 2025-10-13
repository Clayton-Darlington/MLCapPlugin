import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(HelloWorldPlugin)
public class HelloWorldPlugin: CAPPlugin {
    private let implementation = HelloWorld()

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": implementation.echo(value)
        ])
    }

    @objc func getGreeting(_ call: CAPPluginCall) {
        let name = call.getString("name") ?? "World"
        call.resolve([
            "greeting": implementation.getGreeting(name)
        ])
    }
}