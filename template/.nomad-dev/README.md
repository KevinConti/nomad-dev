Nomad Dev per-repo notes

- Keep the generated random topic unless you have a reason to change it
- If you set your own topic, use only letters/numbers plus . _ - characters
- Run ./scripts/nomad wait-notify 10 "nomad test" to verify push notifications
- Use priority if notifications seem delayed: ./scripts/nomad notify --priority 5 "nomad urgent test"
- Keep secrets out of git if this repo is public
