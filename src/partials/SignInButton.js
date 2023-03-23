export default function RenderSignInButton(props) {
    return (
        <button
            className="button button--primary"
            name="signIn"
            onClick={props.loginModal}
        >
            Sign in {props.suffixMessage}
        </button>
    );
}
