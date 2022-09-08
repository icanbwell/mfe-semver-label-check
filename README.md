# Description

This action is used to ensure that pull requests for MFEs have a label indicating the type of semver change so that automation can properly update the version number.


# Example usage

```
uses: icanbwell/mfe-semver-label-check@1.0.0
with:
  github-token: ${{secrets.BWELL_DEV_PAT}}
```
