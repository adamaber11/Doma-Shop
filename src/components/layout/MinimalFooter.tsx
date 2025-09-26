
export function MinimalFooter() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-center items-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} دوما. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
