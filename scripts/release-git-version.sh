#!/bin/bash

# load .env vars

if [ -f .env ]; then
    set -a
    [ -f .env ] && . .env
    set +a
else
    echo "File .env not exists."
    exit 1
fi

# load .release vars

if [ -f .release ]; then
    set -a
    [ -f .release ] && . .release
    set +a
else
    echo "File .release not exists."
    exit 1
fi

echo "-----------------------------------------------------------"
echo "Release [$code_release_version] from $git_from_branch to $git_release_branch branches"
echo "-----------------------------------------------------------"

git switch $git_from_branch

git pull

if git show-ref --verify --quiet "refs/heads/$git_release_branch"; then
    git switch "$git_release_branch"
    git pull
else
    git switch -c "$git_release_branch"
fi

git merge $git_from_branch

git push origin $git_release_branch

echo "-----------------------------------------------------------"

root_folder="$PWD"

find ./apps -type f -name 'package.json' | while read -r file; do
    echo "$file"
    filedir=$(dirname "$file")
    cd "$filedir"
    npm version "$code_release_version" --no-git-tag-version
    cd "$root_folder"
    git add "$file"
done

find ./libs -type f -name 'package.json' -not -path '*/src/lib/generated/*' | while read -r file; do
    echo "$file"
    filedir=$(dirname "$file")
    cd "$filedir"
    npm version "$code_release_version" --no-git-tag-version
    cd "$root_folder"
    git add "$file"
done

npx nx run-many -t lint --fix --skip-nx-cache

git add ./apps/**/package.json

git add ./libs/**/package.json

git commit -m "RELEASE: $code_release_version"

git push origin $git_release_branch

git tag $code_release_version

git push origin $code_release_version

echo "-----------------------------------------------------------"
echo "Release [$code_release_version] from $git_from_branch to $git_release_branch branches created successfully"
echo "-----------------------------------------------------------"
