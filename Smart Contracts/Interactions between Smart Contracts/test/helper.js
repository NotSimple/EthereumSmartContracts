module.exports = {
  expectRevert: async (promise, reason) => { // usage: expectRevert(<tx>, <expected reason>)
    try {
      await promise;
    } catch(error) {
      if (error.reason == reason) return;
    }
    assert.fail('Expected revert throw not received')
  }
}