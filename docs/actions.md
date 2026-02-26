# Preview

name: Preview Build

on:
pull_request:
branches: [main]
types: [opened, synchronize]

jobs:
build:
name: EAS preview build
runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Run tests
        run: npm test -- --passWithNoTests --ci

      - name: Build Android preview
        run: eas build --profile preview --platform android --non-interactive

      - name: Comment build link on PR
        uses: actions/github-script@v7
        if: always()
        with:
          script: |
            const { data: comments } = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });
            const botComment = comments.find(c => c.user.type === 'Bot' && c.body.includes('EAS Preview Build'));
            const body = `### EAS Preview Build

            A new preview build was triggered for this PR.

            View builds: https://expo.dev/accounts/ekoru/projects/EKORU/builds

            > Workflow run: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}`;

            if (botComment) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: botComment.id,
                body,
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body,
              });
            }

# Production

name: Production Build & Submit

on:
push:
tags: - "v*.*.\*"

jobs:
build-android:
name: EAS production build (Android)
runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Run tests
        run: npm test -- --passWithNoTests --ci

      - name: Build Android
        run: eas build --profile production --platform android --non-interactive

      - name: Submit to Play Store
        if: success()
        run: eas submit --profile production --platform android --non-interactive

build-ios:
name: EAS production build (iOS)
runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Run tests
        run: npm test -- --passWithNoTests --ci

      - name: Build iOS
        run: eas build --profile production --platform ios --non-interactive

      - name: Submit to App Store
        if: success()
        run: eas submit --profile production --platform ios --non-interactive
