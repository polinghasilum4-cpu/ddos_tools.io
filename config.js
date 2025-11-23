// Configuration data for Darkness DDoS Toolkit
const attackConfig = {
    version: "3.0",
    author: "Darkness Security Team",
    description: "Advanced Web-Based DDoS Attack Platform",
    license: "For authorized penetration testing only",
    
    attack_methods: {
        udp: {
            type: "network_layer",
            description: "UDP packet flooding attack",
            parameters: {
                packet_size: 1024,
                packet_rate: 1000,
                threads: 50,
                protocol: "UDP"
            },
            effectiveness: "High",
            detection_risk: "Medium"
        },
        tcp: {
            type: "network_layer", 
            description: "TCP SYN flood attack",
            parameters: {
                syn_flag: true,
                window_size: 5840,
                threads: 50,
                protocol: "TCP"
            },
            effectiveness: "High",
            detection_risk: "High"
        },
        http: {
            type: "application_layer",
            description: "HTTP request flooding",
            parameters: {
                methods: ["GET", "POST", "HEAD"],
                keep_alive: true,
                user_agents: [
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
                ],
                threads: 50
            },
            effectiveness: "Medium",
            detection_risk: "Low"
        },
        slowloris: {
            type: "application_layer",
            description: "Slow HTTP headers attack",
            parameters: {
                sockets_count: 200,
                timeout: 15,
                keep_alive: true,
                threads: 10
            },
            effectiveness: "Medium", 
            detection_risk: "Low"
        },
        dns: {
            type: "amplification",
            description: "DNS amplification attack",
            parameters: {
                dns_servers: ["8.8.8.8", "1.1.1.1", "9.9.9.9"],
                amplification_factor: 50,
                query_type: "ANY",
                threads: 25
            },
            effectiveness: "Very High",
            detection_risk: "High"
        },
        multi: {
            type: "combined",
            description: "Multi-vector coordinated attack",
            parameters: {
                vectors: ["udp", "http", "slowloris"],
                coordination: "parallel",
                threads: 100
            },
            effectiveness: "Very High",
            detection_risk: "High"
        }
    },

    payload_templates: {
        http_get: {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Connection": "keep-alive",
                "Cache-Control": "no-cache"
            },
            data: ""
        },
        http_post: {
            method: "POST", 
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "*/*",
                "Connection": "keep-alive"
            },
            data: "username=test&password=test&action=login"
        },
        api_request: {
            method: "POST",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Connection": "keep-alive"
            },
            data: '{"query":"test","page":1,"limit":100}'
        }
    },

    security: {
        auto_stop: true,
        max_duration: 3600,
        max_threads: 1000,
        rate_limiting: false,
        user_agent_rotation: true,
        ip_rotation: false
    },

    monitoring: {
        packet_tracking: true,
        performance_metrics: true,
        target_health_check: true,
        auto_adapt: false
    },

    legal: {
        warning: "This tool is for authorized penetration testing and educational purposes only.",
        requirement: "Always obtain proper authorization before testing.",
        liability: "Users are solely responsible for their actions."
    }
};