export default function MfaChallengePage() {
  return (
    <div>
      <h1 className="font-display text-4xl text-white">Verify Identity</h1>
      <p className="mt-2 text-offwhite">
        Enter your TOTP code or a recovery code to continue.
      </p>
      {/* MFA challenge form will be implemented in a later task */}
    </div>
  );
}
