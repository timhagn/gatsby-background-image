#!/usr/bin/env bash
# Script to execute a local CircleCI run.

# Check if docker is installed.
command -v docker >/dev/null 2>&1 || {
    echo >&2 $'Docker is required to run circleci-cli!\nSee: https://docs.docker.com/install/\nAborting.';
    exit 1;
}

# Check if circleci-cli is installed.
command -v circleci >/dev/null 2>&1 || {
    echo -e >&2 $'circleci-cli is required to execute local jobs!\nSee: https://circleci.com/docs/2.0/local-cli/\nAborting.';
    exit 1;
}

# Still here? Then generate a local config.
echo "Generating local config.yml..."
circleci config process .circleci/config.yml > .circleci/config.local.yml

if [[ ! -f .circleci/config.local.yml ]]; then
    echo >&2 "Local config file not found! Aborting."
    exit 1;
fi

# Everything OK? Then backup default (remote) CircleCI config...
echo "Backing up config.yml..."
mv .circleci/config.yml .circleci/config.remote.yml

# ...and "activate" the local config.
echo "Activating local config.yml..."
mv .circleci/config.local.yml .circleci/config.yml

# Now execute local job.
echo "Executing jobs with circleci..."
circleci local execute

# Restore default config by simply overwriting the generated local one.
echo "Restoring config.yml..."
mv .circleci/config.remote.yml .circleci/config.yml

echo "And we are done, hope every test succeeded ; )!"