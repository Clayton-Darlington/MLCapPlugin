Pod::Spec.new do |s|
  s.name = 'HelloWorldCapacitorPlugin'
  s.version = '0.0.1'
  s.summary = 'A simple Hello World Capacitor plugin'
  s.license = 'MIT'
  s.homepage = 'https://github.com/Clayton-Darlington/MLCapPlugin'
  s.author = 'Clayton Darlington'
  s.source = { :git => 'https://github.com/Clayton-Darlington/MLCapPlugin', :tag => s.version.to_s }
  s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
  s.ios.deployment_target  = '13.0'
  s.dependency 'Capacitor'
  s.swift_version = '5.1'
end