# ios-skin sdk

The Alice iOS SDK.

# install

% cd OoyalaSkinSDK/
% npm install

That will download react-native and any other npm dependencies.

# tests
We use the Jest testing framework. To run tests, run this command:

    npm test

Add tests to `__tests__/` directory where the file is located. When Jest runs, it runs any tests found in `__tests__` directories within the source tree.

Tests must have same name as file with `-test` appended to name.

For example, file `OoyalaSkinSDK/collapsingBarUtils.js` will have test file `OoyalaSkinSDK/__tests__/collapsingBarUtils-test.js`.