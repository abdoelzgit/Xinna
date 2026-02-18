module.exports = {
    apps: [
        {
            name: "xinna",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 3000
            }
        }
    ]
};
