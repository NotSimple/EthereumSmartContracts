module.exports = {
  expectRevert: async (promise, reason) => { // usage: expectRevert(<tx>, <expected reason>)
    try {
      await promise;
    } catch(error) {
      if (error.reason == reason) {
        return;
      } else {
        console.log(error.reason);
        console.log(reason);
        assert.fail('Unexpected revert throw reason');
      }
    }
    assert.fail('Expected revert throw not received');
  },
  expectThrow: async (promise) => {
    try {
      await promise;
    } catch(error) {
      const outOfGas = error.message.search('out of gas') >= 0;
      const revert = error.message.search('revert') >= 0;
      assert(
        outOfGas || revert,
        'Expected throw, got \'' + error + '\' instead',
      );
      return;
    }
    assert.fail('Expected throw not received');
  }
}