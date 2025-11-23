// Configuration for DARKNET DDoS Framework
const attackConfig = {
    version: "4.0",
    author: "DARKNET Security",
    description: "Advanced DDoS Attack Framework",
    license: "For authorized security testing only",
    
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
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
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

    security: {
        auto_stop: true,
        max_duration: 3600,
        max_threads: 1000,
        rate_limiting: false,
        user_agent_rotation: true
    },

    legal: {
        warning: "STRICTLY FOR AUTHORIZED PENETRATION TESTING ONLY",
        requirement: "Always obtain proper authorization before testing",
        liability: "Users are solely responsible for their actions"
    }
};
