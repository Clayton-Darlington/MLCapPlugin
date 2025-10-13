import Foundation

@objc public class HelloWorld: NSObject {
    @objc public func echo(_ value: String) -> String {
        print("Hello World Plugin - Echo: \(value)")
        return value
    }

    @objc public func getGreeting(_ name: String) -> String {
        let greeting = "Hello \(name) from iOS!"
        print("Hello World Plugin - Greeting: \(greeting)")
        return greeting
    }
}