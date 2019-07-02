module.exports = {
  expectRevert: async (promise, reason) => { // usage: expectRevert(<tx>, <expected reason>)
    try {
      await promise;
    } catch(error) {
      if (error.reason == reason) {
        return;
      } else {
        assert.fail('Unexpected revert throw reason');
      }
    }
    assert.fail('Expected revert throw not received');
  }
}