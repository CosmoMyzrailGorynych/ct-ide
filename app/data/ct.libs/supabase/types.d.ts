declare namespace ct {
  namespace supabase {
    function from(table: any): any;
    function rpc(fn: any, args?: any, options?: any): any;
    namespace auth {
      function signUp(credentials: any): any;
      function signInWithPassword(credentials: any): any;
      function signInWithOtp(credentials: any): any;
      function signInWithOAuth(credentials: any): any;
      function signInWithSSO(params: any): any;
      function signOut(): any;
      function resetPasswordForEmail(email: any, options?: any): any;
      function verifyOtp(params: any): any;
      function getSession(): any;
      function refreshSession(currentSession: any): any;
      function getUser(jwt?: any): any;
      function updateUser(attributes: any, options?: any): any;
      function reauthenticate(): any;
      function resend(credentials: any): any;
      function setSession(currentSession: any): any;
      function onAuthStateChange(callback: any): any;
      function exchangeCodeForSession(authCode: any): any;
      namespace mfa {
        function enroll(params: any): any;
        function challenge(params: any): any;
        function verify(params: any): any;
        function challengeAndVerify(params: any): any;
        function unenroll(params: any): any;
        function getAuthenticatorAssuranceLevel(): any;
      }
    }
    namespace functions {
      function invoke(functionName: any, options?: any): any;
    }
    function channel(channel: any): any;
    function removeChannel(channel: any): any;
    function removeAllChannels(): any;
    function getChannels(): any;
    namespace storage {
      function createBucket(id: any, options?: any): any;
      function getBucket(id: any): any;
      function listBuckets(): any;
      function updateBucket(id: any, options: any): any;
      function deleteBucket(id: any): any;
      function emptyBucket(id: any): any;
      function from(bucket: any): any;
    }
  }
}
